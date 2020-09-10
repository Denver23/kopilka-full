function checkRowValidator (childProductsList) {

    let rows = childProductsList.map(item => {
        return Object.keys(item.options).map(elem => { return item.options[elem]}).join('');
    })

    let checkObject = {};
    let resultArray = [];

    rows.forEach(item => {
        if(checkObject.hasOwnProperty(item)) {
            checkObject[item] = ++checkObject[item];
        } else {
            checkObject[item] = 1;
        }
    });

    Object.keys(checkObject).forEach(objectKey => {
        if(checkObject[objectKey] > 1) {
            rows.forEach((item, index) => {
                if(item === objectKey) {
                    resultArray.push(index)
                }
            })
        }
    });

    return resultArray;
};

module.exports.checkRowValidator = checkRowValidator;