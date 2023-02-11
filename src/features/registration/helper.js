import { EmailValidator, LengthValidator, NotEmptyValidator } from "../../validation/validation"

export const validateUsername = (value) => {
    let err;

    err = LengthValidator(value, 4, 40)
    if(err) return err

    return null
} 

export const validateEmail = (value) => {
    let err;
    
    err = EmailValidator(value)
    if(err) return err

    return null
} 

export const validatePassword = (value) => {
    let err;
    
    err = NotEmptyValidator(value)
    if(err) return err

    err = LengthValidator(value, 4, 40)
    if(err) return err

    return null
} 