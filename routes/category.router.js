const {Router} = require('express');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const createMDBQueryObject = require('../common/createQueryObject');
const createCustomFieldsObject = require('../common/createCustomFieldsObject');
const getCategories = require('../common/createNestedCategoriesList');
const {getMaxValue, getMinValue} = require('../common/mathOperations');
const router = Router();

router.get('/:category',
    async (req, res) => {
        try {
            const {category} = req.params;
            const page = req.query.page ? +req.query.page - 1 : 0;
            const limit = req.query.limit && req.query.limit < 50 ? +req.query.limit : 12;

            //request category
            const categoryDB = await Category.findOne({url: category}).populate('childCategories', ['name', 'url', 'childCategories']);

            //get brands IDs from brand-refine
            const brands = req.query.brands;
            let brandsIds = await Brand.find({name: {$in: brands}}, {_id: true});
            brandsIds = brandsIds.map(brand => {
                return brand._id;
            });

            //create customFieldsObject
            let allRefineParameters = Object.keys(req.query).filter(field => {
                return field !== 'page' && field !== 'limit' && field !== 'brands'
            })

            let customFields = createCustomFieldsObject(req.query, allRefineParameters)


            if(!!categoryDB) {
                let categoryId = categoryDB._id;

                //async function to get all nested categories
                let allCategoriesWithProducts = await getCategories(categoryId);

                //array of result products
                let DBquery = createMDBQueryObject(allCategoriesWithProducts, brandsIds, customFields);

                let products = await Product.find(DBquery, {_id: 1, productTitle: 1, childProducts: 1, images: 1}).skip(page * limit).limit(limit).populate('brand');
                let productsCount = await Product.find(DBquery, {_id: true});
                productsCount = productsCount.length;

                if(products.length === 0) {
                    res.json({resultCode: 1, message: '0 Products Found.'});
                    return;
                }

                //get categoryBlock
                let nestedCategories = categoryDB.childCategories;

                let resultCategories = [];

                for (const child of nestedCategories) {
                    let childCategories;
                    if(child.childCategories.length > 0) {
                        childCategories = await Category.findById(child._id, {childCategories: 1, _id: 0}).populate('childCategories', ['name', 'url']);
                    } else {
                        childCategories = [];
                    }

                    let cat = {
                        name: child.name,
                        url: child.url,
                        childCategories
                    };
                    resultCategories = resultCategories.concat(cat);
                }


                //get unique brands in array products for create brands-refine
                let queryForRefineBrands = createMDBQueryObject(allCategoriesWithProducts, [], customFields);
                let uniqueBrands = await Product.find(queryForRefineBrands).distinct('brand');


                let resultBrands = [];
                let brandRefine = null;

                if(uniqueBrands.length > 1) {
                    for (const brand of uniqueBrands) {
                        let resultBrand = await Brand.findById(brand, {name: 1, _id: 0});
                        resultBrands = resultBrands.concat(resultBrand);
                    }
                    resultBrands = resultBrands.map(item => {
                        return item.name;
                    })
                    brandRefine = {
                        title: 'brands',
                        type: 'checkbox',
                        items: resultBrands
                    }
                }

                let resultProducts = await products.map(prod => {

                    let lowPrice = getMinValue(prod.childProducts.map(item => {
                        return item.price;
                    }));

                    let highPrice = getMaxValue(prod.childProducts.map(item => {
                        return item.price;
                    }));

                    let additional;

                    if(prod.childProducts.findIndex(item => {
                        return item.quantity > 0;
                    }) !== -1) {
                        additional = 'In Stock'
                    } else {
                        additional = 'Out of Stock'
                    }

                    return {
                        id: prod._id,
                        brandUrl: prod.brand.url,
                        brand: prod.brand.name,
                        productTitle: prod.productTitle,
                        price: lowPrice === highPrice ? highPrice : `${lowPrice} - ${highPrice}`,
                        additional: additional,
                        imageUrl: prod.images[0].thumbnail
                    }
                })

                //create refines
                let refinesValuesObject = {}
                categoryDB.refines.forEach(refine => {
                    refinesValuesObject[refine.title] = refine.items;
                })
                let refinesProductsObject = {}
                for(let refine of categoryDB.refines) {
                    let refineParameters = allRefineParameters.filter(item => {
                        return item !== refine.title;
                    })
                    let refineCustomFileds = createCustomFieldsObject(req.query, refineParameters);
                    let refineQuery = createMDBQueryObject(allCategoriesWithProducts, brandsIds, refineCustomFileds);
                    const refinesProducts = await Product.find(refineQuery, {customFields: true, _id: false});
                    let arrayOfValues = refinesProducts.map(productCustomFields => {
                        return productCustomFields.customFields.filter(item => {
                            return refine.title in item;
                        })[0];
                    }).filter(productRefine => {
                        return productRefine !== undefined;
                    }).map(item => {
                        return item[refine.title];
                    });
                    refinesProductsObject[refine.title] = [];
                    arrayOfValues.forEach(items => {
                        items.forEach(item => {
                            refinesProductsObject[refine.title].push(item);
                        })
                    })
                    refinesProductsObject[refine.title] = refinesProductsObject[refine.title].filter((item, index) => {
                        return refinesProductsObject[refine.title].indexOf(item) === index;
                    })
                }

                let refines = categoryDB.refines.map(refine => {
                    return {
                        items: refine.items.filter(item => {
                            return refinesProductsObject[refine.title].includes(item);
                        }),
                        title: refine.title,
                        type: refine.type
                    }
                }).filter(refine => {
                    return refine.items.length > 1 || refine.title in req.query;
                })

                let result = {
                    name: categoryDB.name,
                    productCount: productsCount,
                    url: categoryDB.url,
                    childCategories: resultCategories,
                    products: resultProducts,
                    refines: brandRefine !== null ? refines.concat(brandRefine) : refines,
                    reviews: [],
                    bestSellers: [],
                    slides: categoryDB.slides
                }
                res.json({resultCode: 0, productGroup: result})
            } else {
                res.json({resultCode: 10, message: 'Not Found'});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
    })

module.exports = router;