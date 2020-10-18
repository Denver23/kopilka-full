const {Router} = require('express');
const Category = require('../../models/Category');
const router = Router();

router.get('/id:id',
    async (req, res) => {
        try {
            const {id} = req.params;

            const category = await Category.findById(id);

            if(category) {
                let result = {
                    id: category._id,
                    categoryName: category.name,
                    url: category.url,
                    hidden: category.hidden,
                    childCategories: category.childCategories,
                    slides: category.slides,
                    bestSellers: category.bestSellers,
                    refines: category.refines
                };

                res.json({category: result})
            } else {
                res.status(406).json({erorMessage: 'Category Not Found!'})
            }

        } catch (e) {
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

router.post('/id:id',
    async (req, res) => {
        try {
            const {id} = req.params;
            const {data} = req.body;

            let resultCategory = {
                _id: data.id,
                name: data.categoryName,
                url: data.url,
                hidden: data.hidden,
                childCategories: data.childCategories,
                slides: data.slides,
                refines: data.refines,
                bestSellers: data.bestSellers
            };

            await Category.findOneAndUpdate({_id: id}, resultCategory, {new: true}, (err, result) => {
                if(!err) {

                    let resultCategory = {
                        id: result._id,
                        categoryName: result.name,
                        url: result.url,
                        hidden: result.hidden,
                        childCategories: result.childCategories,
                        slides: result.slides,
                        refines: result.refines,
                        bestSellers: result.bestSellers
                    };

                    res.json({category: resultCategory});
                } else {
                    res.status(406).json({erorMessage: 'Category Not Found'});
                }
            });

        } catch (e) {
            console.log(e);
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

module.exports = router;