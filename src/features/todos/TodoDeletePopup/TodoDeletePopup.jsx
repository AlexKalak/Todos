import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import style from './todo-delete-popup.module.scss'
import popupStyle from '../../../scss/custom/popup.module.scss'
import buttonsStyle from '../../../scss/custom/buttons.module.scss'

import { closeDeletePopup, selectDeletePopupData } from '../todosSlice'
import { closePopupAreaClickHandler } from '../../../eventHandlers/popupCloseAreaClickHandler'

const TodoDeletePopup = () => {
  const dispatch = useDispatch()
  const popupData = useSelector(selectDeletePopupData)

  const closeClickHandler = closePopupAreaClickHandler(() => {
      dispatch(closeDeletePopup({accepted: false}))
    }
  )

  return (
    <div 
      className={`${popupStyle.popup} ${popupData?.opened ? popupStyle.active : ""}`}
      onPointerDown={closeClickHandler}
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