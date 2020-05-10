const {Router} = require('express');
const router = Router();
const Brand = require('../models/Brand')

router.get('',
    async (req, res) => {
        try {
            const page = req.query.page ? +req.query.page : 1;
            const quantity = req.query.quantity && req.query.limit < 50 ? +req.query.quantity : 40;

            let allBrandsQuantity = await Brand.find({},{_id: true});
            let brands = await Brand.find({},{_id: false, name: true, url: true}).sort({name: 1}).skip((page - 1) * quantity).limit(quantity);

            res.json({resultCode: 0, brands: brands, quantity: allBrandsQuantity.length})


        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server Error'})
        }
})

module.exports = router;