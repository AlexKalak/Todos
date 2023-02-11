import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeEditPopup, selectEditPopupData, updateTodoThunk } from '../todosSlice'
import { useEffect } from 'react'
import { useRef } from 'react'

import popupStyle from '../../../scss/custom/popup.module.scss'
import style from './todo-edit-popup.module.scss'
import warningsStyle from '../../../scss/custom/warnings.module.scss'

import buttonsStyle from '../../../scss/custom/buttons.module.scss'
import { closePopupAreaClickHandler } from '../../../eventHandlers/popupCloseAreaClickHandler'
import Switch from '../../../components/Switch/Switch'
import { LengthValidator, NotEmptyValidator } from '../../../validation/validation'
import Loading from '../../../components/Loading/Loading'

const TodoEditPopup = () => {
  const dispatch = useDispatch()
  const popupData = useSelector(selectEditPopupData)
  const status = useSelector((state) => state.todos.statuses.updating)
  // const error = useSelector((state) => state.todos.errors.updatingError)
  // const validationErrors = useSelector((state) => state.todos.errors.updationValidationErrors)

  const titleTextareaRef = useRef()
  const taskTextareaRef = useRef()
  const authorTextareaRef = useRef()

  const [state, setState] = useState({
    isEditable: false,
    title: popupData.data?.title,
    titleError: "",
    task: popupData.data?.task,
    taskError: "",
    author: popupData.data?.author,
    authorError: ""
  })
  
  const changeTextareaHeight = (node) => {
    node.style.height = "auto"
    let height = node.scrollHeight
    node.style.height = height + "px"
  }

  const validateTitle = (e) => {
    console.log("in validation")
    let LengthValidationError = LengthValidator(state.title, 3, 45) 
    
    setState(prev => ({
      ...prev,
      titleError: LengthValidationError
    }))

    console.log(LengthValidationError)
    if(LengthValidationError != null) {
      return false
    }
    return true
  }

  const validateTask = (e) => {
    console.log("in validation")
    let LengthValidationError = LengthValidator(state.task, 3, 1500) 
    
    setState(prev => ({
      ...prev,
      taskError: LengthValidationError
    }))

    if(LengthValidationError != null) {
      return false
    }
    return true
  }

  const validateAuthor = (e) => {
    console.log("in validation")
    let  NotEmptyValidationError = NotEmptyValidator(state.author, 3, 1500) 
    
    setState(prev => ({
      ...prev,
      authorError: NotEmptyValidationError
    }))

    if(NotEmptyValidationError != null) {
      return false
    }
    return true
  }


  const buttonClickHandler = (e) => {
    let validTitle = validateTitle()
    let validTask = validateTask()
    let validAuthor = validateAuthor()
    if(validTitle && validTask && validAuthor) {
      sendRequest()
    }
  }

  const sendRequest = () => {
    let data = {
      title: state.title,
      task: state.task,
      author: state.author
    }
    dispatch(updateTodoThunk({
      id: popupData.data?.id ?? 0,
      data
    }))
  }

  useEffect(() => {
    if(titleTextareaRef.current)
      changeTextareaHeight(titleTextareaRef.current)
    if(taskTextareaRef.current)
      changeTextareaHeight(taskTextareaRef.current)
    if(authorTextareaRef.current)
      changeTextareaHeight(authorTextareaRef.current)

    if(popupData.opened === false) {
      setState(prev => ({
        ...prev,
        isEditable: false
      }))
      return
    }
  }, [popupData.opened])
  useEffect(() => {
    setState(prev => ({
      ...prev,
      title: popupData.data?.title ?? "",
      task: popupData.data?.task ?? "",
      author: popupData.data?.author ?? "",
    }))
  }, [popupData.data])

  const textareaChangeHandler = (e) => {
    let textareaId = e.target.id
    changeTextareaHeight(e.target)

    if(textareaId === "title-textarea") {
      setState(prev => ({
        ...prev,
        title: e.target.value
      }))
    } else if (textareaId === "task-textarea") {
      setState(prev => ({
        ...prev,
        task: e.target.value
      }))
    } else if (textareaId === "author-textarea") {
      setState(prev => ({
        ...prev,
        author: e.target.value
      }))
    }
  }

  const closeClickHandler = closePopupAreaClickHandler(() => dispatch(closeEditPopup()))

  return (
    <div 
      className={`${popupStyle.popup} ${popupData?.opened ? popupStyle.active : ""}`}
      onPointerDown={closeClickHandler}
    >
        <div className={`${popupStyle.content}`}>
          <div className={style.container}>

            {status === 'loading' && <Loading width="70px"/>}

            {(status === 'fulfilled' || status === null) && <>
              <div className={style.editingSwitchBlock}>
                <span>Editing:</span>
                <Switch 
                  width="20px" 
                  enabled={state.isEditable} 
                  setEnabled={(val) => {
                    setState(prev => ({
                        ...prev,
                        isEditable: val
                    }))
                  }}/>
              </div>

              <div className={style.textareaBlock}>
                <span>Title</span>
                <textarea 
                  className={style.textarea} 
                  ref={titleTextareaRef}
                  onChange={textareaChangeHandler} 
                  id="title-textarea" 
                  type="text" 
                  disabled={!state.isEditable}
                  value={state.title}
                />
                {state.titleError && <span className={`${warningsStyle.error} ${style.error}`}>{state.titleError}</span>}
              </div>

              <div className={style.textareaBlock}>
                <span>Task</span>
                <textarea 
                  className={style.textarea} 
                  ref={taskTextareaRef}
                  onChange={textareaChangeHandler} 
                  id="task-textarea" 
                  type="text" 
                  disabled={!state.isEditable}
                  value={state.task} 
                />
                {state.taskError && <span className={`${warningsStyle.error} ${style.error}`}>{state.taskError}</span>}
              </div>

              <div className={style.textareaBlock}>
                <span>Author</span>
                <textarea 
                  className={style.textarea} 
                  ref={authorTextareaRef}
                  onChange={textareaChangeHandler} 
                  id="author-textarea" 
                  type="text" 
                  disabled={!state.isEditable}
                  value={state.author} 
                />
                {state.authorError && <span className={`${warningsStyle.error} ${style.error}`}>{state.authorError}</span>}
              </div>

              <button
                className={`${buttonsStyle["button--primary"]} ${style.saveButton}`} 
                disabled={!state.isEditable}
                onClick={buttonClickHandler}
              >
                Save
              </button>
            </>}

          </div>
        </div>
    </div>
  )
}

export default TodoEditPopup