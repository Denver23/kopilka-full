const {Router} = require('express');
const Product = require('../../models/Product');
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
                    childProducts: product.childProducts,
                    images: product.images,
                    customFields: product.customFields,
                    shortDescription: product.shortDescription,
                    specifications: product.specifications,
                    features: product.features,
                    recommendedProducts: [],
                    productCategoryCustomFields: product.category.refines
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