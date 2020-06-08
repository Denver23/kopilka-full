export type FieldValidatorType = (value: string) => string | undefined

export const requiredField: FieldValidatorType = (value) => {
    if(value) return undefined;
    return 'Field is required';
}
export const emailType: FieldValidatorType = (value) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(reg.test(value)) return undefined;
    return 'E-Mail is uncorrected'
}

export const phoneType: FieldValidatorType = (value) => {
    var reg = /^\d[\d\(\)\ -]{4,14}\d$/;
    if(reg.test(value)) return undefined;
    return 'Phone is uncorrected'
}

export const minLength: FieldValidatorType = (value) => {
    if(value.length >= 5) return undefined;
    return `Field must be longer than 5 symbols`
}