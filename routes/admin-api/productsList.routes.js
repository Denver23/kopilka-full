const {Router} = require('express');
const router = Router();
const Product = require('../../models/Product');

router.get('',
    async (req, res) => {
        try {
            let {page, productsOnPage, brand, category} = req.query;

            let productsQuantity = await Product.find({});
            let products = await Product.find({}).skip((+page - 1) * +productsOnPage).limit(productsOnPage < 50 ? +productsOnPage : 20).populate('brand').populate('category');

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
    })

module.exports = router;