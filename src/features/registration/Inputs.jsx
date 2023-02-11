import React from 'react'
import style from './registration-page.module.scss'

const Inputs = ({state, setState}) => {
  return (
        <>
            <div className={style.inputBlock}>
                <input 
                    placeholder='Username' 
                    type="text" 
                    className={style.input} 
                    value={state.username}
                    onChange={(e) => {
                        setState(prev => 
                            ({
                                ...prev, 
                                username: e.target.value,
                                usernameError: ""
                            })
                        )}
                        
                    }/>
                <div className={`${style.error} ${state.usernameError ? style.active : ""}`}>
                        {state.usernameError}
                </div>
            </div>
            
            <div className={style.inputBlock}>
                <input 
                    placeholder='Email' 
                    type="email" 
                    className={style.input} 
                    value={state.email}
                    onChange={(e) => {
                        setState(prev => 
                            ({
                                ...prev, 
                                email: e.target.value,
                                emailError: ""
                            })
                        )}
                        
                    }/>
                <div className={`${style.error} ${state.emailError ? style.active : ""}`}>
                        {state.emailError}
                </div>
            </div>
            
            <div className={style.inputBlock}>
                <input 
                    placeholder='Password' 
                    type="password" 
                    className={style.input} 
                    value={state.password}
                    onChange={(e) => {
                        setState(prev => 
                            ({
                                ...prev, 
                                password: e.target.value,
                                passwordError: ""
                            })
                        )}
                        
                    }/>
                <div className={`${style.error} ${state.passwordError ? style.active : ""}`}>
                        {state.passwordError}
                </div>
            </div>
        </>
  )
}

export default Inputs