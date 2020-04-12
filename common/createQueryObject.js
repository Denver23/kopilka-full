function createMDBQueryObject(categoriesList, brandsList, customFields) {
    let queryObject = {};
    if(categoriesList.length > 0) {
        queryObject.category = {$in: categoriesList}
    }
    if(brandsList.length > 0) {
        queryObject.brand = {$in: brandsList}
    }
    if(customFields.$all.length > 0) {
        queryObject.customFields = customFields
    }

    return queryObject;
}

module.exports = createMDBQueryObject;