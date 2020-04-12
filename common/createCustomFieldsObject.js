function createCustomFieldsObject(queryStringObject, queryParameters) {
    let queryObject = {$all: []};
    queryParameters.forEach(field => {
        let filter = {$elemMatch: {}};
        if(Array.isArray(queryStringObject[field])) {
            filter.$elemMatch[field] = {$in: queryStringObject[field]}
        } else {
            filter.$elemMatch[field] = queryStringObject[field];
        }
        queryObject.$all.push(filter);
    });
    return queryObject;
}

module.exports = createCustomFieldsObject;