import React from 'react'
import { useDispatch } from 'react-redux'

import buttonStyles from '../../../scss/custom/buttons.module.scss'
import { LengthValidation } from '../../../validation/validation'
import { openCreatePopup } from '../todosSlice'
import style from './todo-buttons.module.scss'


const TodoButtons = () => {
  const dispatch = useDispatch()

  const openPopup = () => {
    dispatch(openCreatePopup())
  }
  

  return (
    <div className={style.container}>
        <button 
            onClick={openPopup}
            className={`${buttonStyles["button--primary"]} ${style.createButton}`}
        >
            Create new todo
        </button>
    </div>
  )
}

export default TodoButtons