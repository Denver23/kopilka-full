const {Router} = require('express');
const router = Router();
const Product = require('../../models/Product');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');

router.get('',
    async (req, res) => {
        try {
            let {page, categoriesOnPage, name, url} = req.query;
            let resultCategories = [];
            let categoriesQuantity = 0;
            let queryObject = {};

            if(name !== undefined) {
                queryObject.name = new RegExp('[\d+\s+\w+]?' + name + '[\d+\s+\w+]?', 'i');
            } else if(url !== undefined) {
                queryObject.url = new RegExp('[\d+\s+\w+]?' + url + '[\d+\s+\w+]?', 'i');
            }

            resultCategories = await Category.find(queryObject, {_id: true, childCategories: true, name: true, url: true, hidden: true}).skip((+page - 1) * +categoriesOnPage).limit(categoriesOnPage < 50 ? +categoriesOnPage : 20);
            categoriesQuantity = await Category.find(queryObject, {_id: true, childCategories: true, name: true, url: true, hidden: true});


            let result = resultCategories.map(category => {
                return {
                    _id: category._id,
                    key: category._id,
                    name: category.name,
                    url: category.url,
                    childsQuantity: category.childCategories.length,
                    hidden: category.hidden
                }
            });

            res.json({categories: result, totalCount: categoriesQuantity.length});

        } catch (e) {
            console.log(e);
            res.status(500).json({errorMessage: 'Server Error'})
        }
    });

router.put('', async(req, res) => {
    try {
        let {items, params} = req.body;

        let finalyParamsObject = {};
        let changeKey = Object.keys(params)[0];
        if(changeKey === 'category') {
            let categoryId = await Category.findOne({name: params[changeKey]}, {_id: true});
            finalyParamsObject[changeKey] = categoryId._id
        } else if(changeKey === 'brand') {
            let brandId = await Brand.findOne({name: params[changeKey]}, {_id: true});
            finalyParamsObject[changeKey] = brandId._id
        } else if(changeKey === 'hidden') {
            finalyParamsObject[changeKey] = params[changeKey];
        } else if(changeKey === 'delete') {
            await Product.remove({_id: {$in: items}}, function(err, result){

                if(err) {
                    res.status(418).json({error: 'Cant Delete selected products'})
                    return;
                };

                res.status(200).send();
            });
            return;
        }

        await Product.updateMany({_id: {$in: items}}, finalyParamsObject);

        res.status(200).send();

    } catch (e) {
        console.log(e);
        res.status(500).json({errorMessage: 'Server Error'})
    }
});

module.exports = router;