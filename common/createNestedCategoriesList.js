const Category = require('../models/Category');

async function getCategories(categoryId) {
    let category = await Category.findById(categoryId, {_id: 1, childCategories: 1});
    if(category.childCategories.length === 0) {
        return [categoryId];
    } else {
        let allCategories = [];
        for (const child of category.childCategories) {
            let cat = await getCategories(child);
            allCategories = allCategories.concat(cat);
        }
        return allCategories;
    }
}

module.exports = getCategories;