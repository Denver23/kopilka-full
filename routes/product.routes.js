const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const router = Router();

router.get('/:brand/id:id',
    async (req, res) => {
        try {
            const {id, brand} = req.params;

            const product = await Product.findById(id).populate('brand').populate('category');

            if(product.brand.url === brand) {
                let result = {
                    id: product._id,
                    brand: product.brand.name,
                    category: product.category.url,
                    productTitle: product.productTitle,
                    childProducts: product.childProducts,
                    images: product.images,
                    productBrandImage: product.brand.slides[0],
                    shortDescription: product.shortDescription,
                    specifications: product.specifications,
                    features: product.features,
                    recommendedProducts: []
                }
                res.json({resultCode: 0, product: result})
            } else {
                res.json({resultCode: 1, message: 'Product Not Find'})
            }

        } catch (e) {
            res.status(500).json({message: 'Server Error'})
        }
})

module.exports = router;