const {Router} = require('express');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Category = require('../models/Category');
const createMDBQueryObject = require('../common/createQueryObject');
const createCustomFieldsObject = require('../common/createCustomFieldsObject');
const {getMaxValue, getMinValue} = require('../common/mathOperations');
const router = Router();

router.get('/:brand',
    async (req, res) => {
        try {
            const {brand} = req.params;
            const page = req.query.page ? +req.query.page - 1 : 0;
            const limit = req.query.limit && req.query.limit < 50 ? +req.query.limit : 12;

            const brandDB = await Brand.findOne({url: brand})

            if(!!brandDB) {
                const brandId = brandDB._id;

                //create customFieldsObject
                let allRefineParameters = Object.keys(req.query).filter(field => {
                    return field !== 'page' && field !== 'limit' && field !== 'brands'
                })

                let customFields = createCustomFieldsObject(req.query, allRefineParameters)

                let DBquery = createMDBQueryObject([], [brandId], customFields);

                const products = await Product.find(DBquery, {_id: true, productTitle: true, childProducts: true, images: true}).skip(page * limit).limit(limit);
                let allProducts = await Product.find(DBquery, {_id: true});
                const productsCount = allProducts.length;

                const childCategoriesIds = await Product.find(DBquery, {category: 1}).distinct('category');

                const categories = await Category.find({_id: childCategoriesIds}, {name: 1, url: 1, childCategories: 1}).populate('childCategories');

                let categoriesResult = categories.length > 1 ? categories.map(category => {
                    let childs = category.childCategories.map(child => {
                        return {
                            name: child.name,
                            url: child.url
                        }
                    })
                    return {
                        name: category.name,
                        url: category.url,
                        childCategories: childs,
                    }
                }) : [];

                if(productsCount === 0) {
                    res.json({resultCode: 1, message: '0 Products Found.'})
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
                        brandUrl: brandDB.url,
                        brand: brandDB.name,
                        productTitle: prod.productTitle,
                        price: lowPrice === highPrice ? highPrice : `${lowPrice} - ${highPrice}`,
                        additional: additional,
                        imageUrl: prod.images[0].thumbnail
                    }
                })


                //create refines
                let refinesValuesObject = {}
                brandDB.refines.forEach(refine => {
                    refinesValuesObject[refine.title] = refine.items;
                })
                let refinesProductsObject = {}
                for(let refine of brandDB.refines) {
                    let refineParameters = allRefineParameters.filter(item => {
                        return item !== refine.title;
                    })
                    let refineCustomFileds = createCustomFieldsObject(req.query, refineParameters);
                    let refineQuery = createMDBQueryObject([], brandId, refineCustomFileds);
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

                let refines = brandDB.refines.map(refine => {
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
                    name: brandDB.name,
                    productCount: productsCount,
                    url: brandDB.url,
                    childCategories: categoriesResult,
                    products: resultProducts,
                    refines: refines,
                    reviews: [],
                    bestSellers: [],
                    slides: brandDB.slides
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

/*router.get('/',
    async (req, res) => {
        try {
            const brand = new Brand({
                name: 'Apple',
                url: 'apple',
                refines: [{
                    title: "Available",
                    type: "radio",
                    items: ['In Storage', 'In Online-Shop']
                }, {
                    title: "Condition",
                    type: "checkbox",
                    items: ['New', 'Manufacter Refurbished', 'Seller Refurbished', 'Used', 'For Parts or not Working']
                }, {
                    title: "Delivery Options",
                    type: "radio",
                    items: ['FREE', '$4.99']
                }],
                bestSellers: [],
                slides: ['https://bitnovosti.com/wp-content/uploads/2019/06/Apple-2-11.jpg']
            })

            await brand.save()

            res.json(brand);

        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
    }) */

module.exports = router;