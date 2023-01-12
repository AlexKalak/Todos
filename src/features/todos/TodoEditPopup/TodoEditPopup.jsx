import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import popupStyle from '../../../scss/custom/popup.module.scss'
import style from './todo-popup.module.scss'
import { closeEditPopup, selectEditPopupData } from '../todosSlice'

const TodoEditPopup = () => {
  const dispatch = useDispatch()
  const popupData = useSelector(selectEditPopupData)

  const [state, setState] = useState({
    isEditable: false,
    "title-textarea": popupData.data?.title,
    taskTextareaValue: popupData.data?.task,
    authorTextareaValue: popupData.data?.author
  })
  
  const textareaChangeHandler = (e) => {
    let textareaId = e.target.id

    e.target.style.height = "auto"
    
    let height = e.target.scrollHeight
    console.log(height)
    e.target.style.height = height + "px"

    if(textareaId === "title-textarea") {
      setState(prev => ({
        ...prev,
        "title-textarea": e.target.value
      }))
    } else if (textareaId === "task-textarea") {
      setState(prev => ({
        ...prev,
        "task-textarea": e.target.value
      }))
    } else if (textareaId === "author-textarea") {
      setState(prev => ({
        ...prev,
        "author-textarea": e.target.value
      }))
    }
  }

  return (
    <div 
      className={`${popupStyle.popup} ${popupData?.opened ? popupStyle.active : ""}`}
      onClick={(e) => {
        if(e.currentTarget !== e.target)
          return
        dispatch(closeEditPopup())
      }}
    >
        <div className={`${popupStyle.content}`}>
          <div className={style.container}>
            <div className={style.textareaBlock}>
              <span>Title</span>
              <textarea className={style.textarea} onChange={textareaChangeHandler} id="title-textarea" type="text" value={state["title-textarea"] ??  popupData.data?.title} />
            </div>
            <div className={style.textareaBlock}>
              <span>Title</span>
              <textarea className={style.textarea} onChange={textareaChangeHandler} id="task-textarea" type="text" value={state["task-textarea"] ??  popupData.data?.task} />
            </div>
            <div className={style.textareaBlock}>
              <span>Title</span>
              <textarea className={style.textarea} onChange={textareaChangeHandler} id="author-textarea" type="text" value={state["author-textarea"] ??  popupData.data?.author} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default TodoEditPopup