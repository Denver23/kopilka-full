const {Router} = require('express');
const checkProductsForSave = require('../../common/checkProductsForSave');
const Product = require('../../models/Product');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');
const router = Router();

router.get('/id:id',
    async (req, res) => {
        try {
            const {id} = req.params;

            const product = await Product.findById(id).populate('brand').populate('category');

            if(product.brand.url) {
                let result = {
                    id: product._id,
                    brand: product.brand.name,
                    category: product.category.name,
                    productTitle: product.productTitle,
                    hidden: product.hidden,
                    childProducts: product.childProducts,
                    images: product.images,
                    customFields: product.customFields,
                    shortDescription: product.shortDescription,
                    specifications: product.specifications,
                    features: product.features,
                    recommendedProducts: [],
                    productCategoryCustomFields: product.category.refines
                };
                res.json({product: result})
            } else {
                res.status(406).json({erorMessage: 'Product Not Found!'})
            }

        } catch (e) {
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

router.post('/id:id',
    async (req, res) => {
        try {
            const {id} = req.params;
            const {data} = req.body;

            const brand = await Brand.findOne({name: data.brand});
            const category = await Category.findOne({name: data.category});


            let childValidator = checkProductsForSave.checkRowValidator(data.childProducts);
            let emptyOptions = data.childProducts.filter((item) => {
                let options = item.options;
                Object.keys(options).forEach(option => {
                    if(item[option] === '') {
                        return true;
                    }
                    return false
                })
            });
            const categoryRefines = category.refines.map(refine => refine.title);
            let validateCustomFields = data.customFields.filter(customField => {
                return categoryRefines.includes(Object.keys(customField)[0]);
            });

            if(brand === null || category === null) {
                res.status(406).json({erorMessage: 'Brand or Category Not Found'});
                return;
            } else if (childValidator.length || emptyOptions.length) {
                res.status(409).json({erorMessage: 'Some child products has the same options or empty'});
                return;
            } else if(data.productTitle === undefined || data.productTitle.length === 0) {
                res.status(406).json({erorMessage: 'Product Title is empty'});
                return;
            } else if(data.childProducts === undefined || data.childProducts.length < 1) {
                res.status(406).json({erorMessage: 'Child Products is empty'});
                return;
            }



            let resultProduct = {
                _id: data.id,
                brand: brand._id,
                category: category._id,
                productTitle: data.productTitle,
                hidden: data.hidden,
                childProducts: data.childProducts,
                images: data.images,
                shortDescription: data.shortDescription,
                specifications: data.specifications,
                features: data.features,
                customFields: validateCustomFields
            };

            await Product.findOneAndUpdate({_id: id}, resultProduct, {new: true}, (err, result) => {
                if(!err) {

                    let resultProduct = {
                        id: result._id,
                        brand: brand.name,
                        category: category.name,
                        productTitle: result.productTitle,
                        hidden: result.hidden,
                        childProducts: result.childProducts,
                        images: result.images,
                        customFields: result.customFields,
                        shortDescription: result.shortDescription,
                        specifications: result.specifications,
                        features: result.features,
                        recommendedProducts: [],
                        productCategoryCustomFields: category.refines
                    };

                    res.json({product: resultProduct});
                } else {
                    res.status(406).json({erorMessage: 'Product Not Found'});
                }
            });

        } catch (e) {
            console.log(e);
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

router.post('/new-product',
    async (req, res) => {
        try {
            const {data} = req.body;

            const brand = await Brand.findOne({name: data.brand});
            const category = await Category.findOne({name: data.category});


            let childValidator = checkProductsForSave.checkRowValidator(data.childProducts);
            let emptyOptions = data.childProducts.filter((item) => {
                let options = item.options;
                Object.keys(options).forEach(option => {
                    if(item[option] === '') {
                        return true;
                    }
                    return false
                })
            });
            const categoryRefines = category.refines.map(refine => refine.title);
            let validateCustomFields = data.customFields.filter(customField => {
                return categoryRefines.includes(Object.keys(customField)[0]);
            });

            if(brand === null || category === null) {
                res.status(406).json({erorMessage: 'Brand or Category Not Found'});
                return;
            } else if (childValidator.length || emptyOptions.length) {
                res.status(409).json({erorMessage: 'Some child products has the same options or empty'});
                return;
            } else if(data.productTitle === undefined || data.productTitle.length === 0) {
                res.status(406).json({erorMessage: 'Product Title is empty'});
                return;
            } else if(data.childProducts === undefined || data.childProducts.length < 1) {
                res.status(406).json({erorMessage: 'Child Products is empty'});
                return;
            }


            let resultProduct = {
                _id: data.id,
                brand: brand._id,
                category: category._id,
                productTitle: data.productTitle,
                hidden: data.hidden,
                childProducts: data.childProducts,
                images: data.images,
                shortDescription: data.shortDescription,
                specifications: data.specifications,
                features: data.features,
                customFields: validateCustomFields
            };

            await Product.create(resultProduct, (err, result) => {
                if(!err) {

                    res.status(201).json({id: result._id});
                } else {
                    res.status(418).json({erorMessage: 'Cant create product'});
                }
            });

        } catch (e) {
            console.log(e);
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

router.post('/delete-product',
    async (req, res) => {
        try {
            const {id} = req.body;

            await Product.findByIdAndDelete(id, (err, result) => {
                if(!err) {

                    res.status(200).send();
                } else {
                    res.status(418).json({erorMessage: 'Cant create product'});
                }
            });

        } catch (e) {
            console.log(e);
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

module.exports = router;