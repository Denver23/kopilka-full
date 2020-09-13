const {Router} = require('express');
const router = Router();
const Brand = require('../../models/Brand')

router.get('',
    async (req, res) => {
        try {
            res.json({brands: 'brands'})

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

module.exports = router;