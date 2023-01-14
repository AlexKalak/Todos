export const LengthValidation = (value, min, max) => {
    if(!value)
        return "this field is required"
    if(value.length < min) {
        return `min: ${min} symbols` 
    }
    if(value.length > max) {
        return `max: ${max} symbols` 
    }
    return null
}

export const NotEmptyValidator = (value) => {
    if(!value)
        return "this field is required"
    if(value.length <= 0) {
        return `this field is required` 
    }
    return null
}