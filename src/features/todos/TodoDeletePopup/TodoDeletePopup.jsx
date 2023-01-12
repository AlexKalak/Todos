import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import style from './todo-delete-popup.module.scss'
import popupStyle from '../../../scss/custom/popup.module.scss'
import buttonsStyle from '../../../scss/custom/buttons.module.scss'

import { closeDeletePopup, selectDeletePopupData } from '../todosSlice'

const TodoDeletePopup = () => {
  const dispatch = useDispatch()
  const popupData = useSelector(selectDeletePopupData)

  return (
    <div 
      className={`${popupStyle.popup} ${popupData?.opened ? popupStyle.active : ""}`}
      onClick={(e) => {
        if(e.currentTarget !== e.target)
          return
        dispatch(closeDeletePopup({accepted: false}))
      }}
    >
        <div className={`${popupStyle.content}  ${style.container}`}>
            <button 
              className={`${buttonsStyle["button--danger"]} ${style.button}`}
              onClick={() => {
                dispatch(closeDeletePopup({accepted: true}))
              }}
            >Удалить</button>
        </div>
    </div>
  )
}

export default TodoDeletePopup