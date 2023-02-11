const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export const LengthValidator = (value, min, max) => {
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

export const EmailValidator = (value) => {
    let valid = emailRegex.test(value)
    if (!valid) return "this fiels should be email"
}