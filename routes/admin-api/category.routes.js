const {Router} = require('express');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const router = Router();

router.get('/id:id',
    async (req, res) => {
        try {
            const {id} = req.params;

            const category = await Category.findById(id).populate('childCategories');

            if(category) {
                let productsQuantity = {};
                productsQuantity[id] = await Product.find({category: id}, {_id: true});
                for(let i = 0; i < category.childCategories.length; i++) {
                    let childCategoryId = category.childCategories[i]._id;
                    productsQuantity[childCategoryId] = await Product.find({category: childCategoryId}, {_id: true});
                }
                let childCategories = category.childCategories.map(category => {
                    return {productsQuantity: productsQuantity[category._id].length,...category._doc}
                });
                let result = {
                    _id: category._id,
                    name: category.name,
                    url: category.url,
                    hidden: category.hidden,
                    childCategories,
                    slides: category.slides,
                    bestSellers: category.bestSellers,
                    refines: category.refines,
                    productsQuantity: productsQuantity[id].length
                };

                res.json({category: result})
            } else {
                res.status(406).json({erorMessage: 'Category Not Found!'})
            }

        } catch (e) {
            console.log(e);
            res.status(500).json({erorMessage: 'Server Error'})
        }
    });

router.get('/name-:name',
    async (req, res) => {
        try {
            const {name} = req.params;

            const category = await Category.findOne({name});

            if(category) {
                let productsQuantity = {};
                productsQuantity[category._id] = await Product.find({category: category._id}, {_id: true});

                let result = {
                    _id: category._id,
                    name: category.name,
                    url: category.url,
                    hidden: category.hidden,
                    childCategories: category.childCategories,
                    slides: category.slides,
                    bestSellers: category.bestSellers,
                    refines: category.refines,
                    productsQuantity: productsQuantity[category._id].length
                };

                res.json({category: result})
            } else {
                res.status(406).json({erorMessage: 'Category Not Found!'})
            }

        } catch (e) {
            console.log(e);
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
