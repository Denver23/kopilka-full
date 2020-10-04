const {Router} = require('express');
const router = Router();
const Brand = require('../../models/Brand')

router.get('',
    async (req, res) => {
        try {
            const value = req.query.value ? req.query.value : '';
            var query = new RegExp('^' + value + '[\d+\s+\w+]?', 'i');
            let brands = await Brand.find({name: query},{_id: false, name: true, url: true}).sort({name: 1}).limit(100);

            res.json({brands: brands})


        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

module.exports = router;