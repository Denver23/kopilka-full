function createCustomSearchQuery (fields, searchQuery, method = '$or') { //method is variant $or/$and

    let queryArray;

    if(Array.isArray(searchQuery)) {
        queryArray = searchQuery;
    } else {
        queryArray = searchQuery.split(' ');
    }
    let queryObject = {};

    if(Array.isArray(fields)) {
        queryObject['$or'] = [];
        fields.forEach(field => {
            let fieldQueries = createCustomSearchQuery(field, searchQuery, method);
            queryObject['$or'] = queryObject['$or'].concat(fieldQueries[method]);
        })
    } else {
        queryObject[method] = [];
        queryArray.forEach(searchWord => {
            let searchWordObject = {};
            const regex = new RegExp(`${searchWord}`, 'i');
            searchWordObject[fields] = {$regex: regex};
            queryObject[method].push(searchWordObject);
        })
    }

    return queryObject;
}

module.exports = createCustomSearchQuery;