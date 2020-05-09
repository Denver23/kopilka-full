const {Router} = require('express');
const router = Router();
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const createCustomSearchQuery = require('../common/createCustomSearchQuery');

router.get('',
    async (req, res) => {
        try {
            let {searchQuery} = req.query;
            let resultProducts;
            searchQuery = searchQuery.match(/[\d\w ]/gi).join('').replace(/\s+/g, ' ').trim();

            let brandQuery = createCustomSearchQuery('name', searchQuery);

            let resultBrand = await Brand.findOne(brandQuery, {name: true})

            if(resultBrand !== null) {
                let searchWordsWithoutBrand = searchQuery.split(' ').filter(item => {
                    return item.toLowerCase() !== resultBrand.name.toLowerCase();
                })
                let productTitleQuery = createCustomSearchQuery('productTitle', searchWordsWithoutBrand, '$and');
                let resultQuery = {$and: [{brand: resultBrand._id}, productTitleQuery]}

                resultProducts = await Product.find(productTitleQuery, {brand: true, productTitle: true, images: true}).limit(6).populate('brand');
            } else {
                let productTitleQuery = createCustomSearchQuery('productTitle', searchQuery, '$and');
                resultProducts = await Product.find(productTitleQuery, {brand: true, productTitle: true, images: true}).limit(6).populate('brand');
            }

            let result = resultProducts.map(item => {
                return {
                    id: item._id,
                    brand: item.brand.name,
                    productTitle: item.productTitle,
                    image: item.images[0].thumbnail
                }
            })

            res.json({resultCode: 0, data: result})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
    })

module.exports = router;