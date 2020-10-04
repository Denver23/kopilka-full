const {Router} = require('express');
const router = Router();
const Product = require('../../models/Product');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');

router.get('',
    async (req, res) => {
        try {
            let {page, productsOnPage, brand, category, productTitle} = req.query;
            let requestObject = {};
            if(brand !== undefined) {
                let brandArray = await Brand.find({name: new RegExp('[\d+\s+\w+]?' + brand + '[\d+\s+\w+]?', 'i')}, {_id: true});
                requestObject.brand = {$in : brandArray.map(item => {return item._id})};
            }
            if(productTitle !== undefined) {
                requestObject.productTitle = new RegExp('[\d+\s+\w+]?' + productTitle + '[\d+\s+\w+]?', 'i');
            }
            if(category !== undefined) {
                let categoryArray = await Category.find({name: new RegExp('[\d+\s+\w+]?' + category + '[\d+\s+\w+]?', 'i')}, {_id: true});
                requestObject.category = {$in : categoryArray.map(item => {return item._id})};
            }

            let productsQuantity = await Product.find(requestObject);
            let products = await Product.find(requestObject).skip((+page - 1) * +productsOnPage).limit(productsOnPage < 50 ? +productsOnPage : 20).populate('brand').populate('category');

            let resultProducts = products.map(product => {
                return {
                    _id: product._id,
                    key: product.id,
                    brand: product.brand.name,
                    category: product.category.name,
                    productTitle: product.productTitle,
                    hidden: product.hidden
                }
            });

            res.json({products: resultProducts, totalCount: productsQuantity.length});

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    });

router.put('', async(req, res) => {
    try {
        let {items, params} = req.body;

        let finalyParamsObject = {};
        let changeKey = Object.keys(params)[0];
        if(changeKey === 'category') {
            let categoryId = await Category.findOne({name: params[changeKey]}, {_id: true});
            finalyParamsObject[changeKey] = categoryId._id
        } else if(changeKey === 'brand') {
            let brandId = await Brand.findOne({name: params[changeKey]}, {_id: true});
            finalyParamsObject[changeKey] = brandId._id
        } else if(changeKey === 'hidden') {
            finalyParamsObject[changeKey] = params[changeKey];
        } else if(changeKey === 'delete') {
            await Product.remove({_id: {$in: items}}, function(err, result){

                if(err) {
                    res.status(418).json({error: 'Cant Delete selected products'})
                    return;
                };

                res.status(200).send();
            });
            return;
        }

        await Product.updateMany({_id: {$in: items}}, finalyParamsObject);

        res.status(200).send();

    } catch (e) {
        console.log(e);
        res.status(500).json({errorMessage: 'Server Error'})
    }
});

module.exports = router;