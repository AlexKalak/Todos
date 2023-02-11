import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { validateEmail, validatePassword, validateUsername } from './helper'
import Inputs from './Inputs'

import style from './registration-page.module.scss'
import { registrateThunk } from './registrationSlice'

const RegistrationPage = () => {
    const dispatch = useDispatch()

    const [state, setState] = useState({
        email: "",
        emailError: "",

        username: "",
        usernameError: "",

        password: "",
        passwordError: "",

    })

    const validateFields = () => {
        let emailError = validateEmail(state.email)
        let usernameError = validateUsername(state.username) 
        let passwordError = validatePassword(state.password) 
        
        let flag = true

        if (usernameError !== null) {
            setState(prev => ({
                ...prev,
                usernameError 
            }))
            flag = false
        }

        if (emailError !== null) {
            setState(prev => ({
                ...prev,
                emailError 
            }))
            flag = false
        }

        if (passwordError !== null) {
            setState(prev => ({
                ...prev,
                passwordError 
            }))
            flag = false
        }

        return flag
    }

    const buttonClickHandler = (e) => {
        // let allInputsValid = validateFields()
        // if (!allInputsValid) {
        //     return
        // }
        
        let data = {
            username: state.username,
            email: state.email,
            password: state.password,
        }
        console.log('dispatching')
        dispatch(registrateThunk({data}))
    }

    return (
        <div className={style.container}>
            <h1>Registration</h1>
            <Inputs state={state} setState={setState}/>
            <button 
                className={`${style.button}`}
                onClick={buttonClickHandler}
            >
                Send request
            </button>
        </div>
    )
}

export default RegistrationPage