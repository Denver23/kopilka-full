const {Router} = require('express');
const router = Router();
const Category = require('../../models/Category')

router.get('',
    async (req, res) => {
        try {
            const value = req.query.value ? req.query.value : '';
            var query = new RegExp('^' + value + '[\s+\w+]?', 'i');
            let categories = await Category.find({name: query},{_id: false, name: true, url: true}).sort({name: 1}).limit(100);

            res.json({categories: categories})


        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

router.get('/refines/:category',
    async (req, res) => {
        try {
            const {category} = req.params;

            let categoryResult = await Category.findOne({name: category}, {
                _id: false,
                refines: true
            });

            if(categoryResult) {
                res.json({refines: categoryResult.refines})
            } else {
                res.json(res.status(406).json({erorMessage: 'Category Not Found!'}))
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    })

module.exports = router;