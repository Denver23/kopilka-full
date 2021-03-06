const {Router} = require('express');
const Product = require('../models/Product');
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
                res.json({product: result})
            } else {
                res.status(406).json({erorMessage: 'Product Not Found!'})
            }

        } catch (e) {
            res.status(500).json({erorMessage: 'Server Error'})
        }
})

module.exports = router;