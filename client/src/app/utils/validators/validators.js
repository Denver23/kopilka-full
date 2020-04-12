export const requiredField = (value) => {
    if(value) return undefined;
    return 'Field is required';
}
export const emailType = (value) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(reg.test(value)) return undefined;
    return 'E-Mail is uncorrected'
}

export const minLength = (value) => {
    if(value.length >= 5) return undefined;
    return `Field must be longer than 5 symbols`
}