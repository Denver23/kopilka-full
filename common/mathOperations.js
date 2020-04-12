const getMaxValue = (array) => {
    let max = array[0];
    for (let i = 0; i < array.length; i++) {
        if (max < array[i]) max = array[i];
    }
    return max;
};

const getMinValue = (array) => {
    let min = array[0];
    for (let i = 0; i < array.length; i++) {
        if (min > array[i]) min = array[i];
    }
    return min;
};

exports.getMaxValue = getMaxValue;
exports.getMinValue = getMinValue;