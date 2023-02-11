import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { LengthValidator, NotEmptyValidator } from '../../../validation/validation'

import { clearCreatePopup, closeCreatePopup, createTodoThunk, selectCreatePopupIsOpened,  } from '../todosSlice'

import Loading from '../../../components/Loading/Loading'

import popupStyle from '../../../scss/custom/popup.module.scss'
import buttonsStyle from '../../../scss/custom/buttons.module.scss'
import style from './todo-create-popup.module.scss'
import warningsStyle from '../../../scss/custom/warnings.module.scss'
import { closePopupAreaClickHandler } from '../../../eventHandlers/popupCloseAreaClickHandler'


const TodoCreatePopup = () => {

  const dispatch = useDispatch()
  const opened = useSelector(selectCreatePopupIsOpened)
  const status = useSelector((state) => state.todos.statuses.creating)
  const error = useSelector((state) => state.todos.errors.creatingError)
  const validationErrors = useSelector((state) => state.todos.errors.creatingValidationErrors)

  const [title, setTitle] = useState("")
  const [titleError, setTitleError] = useState("")

  const [task, setTask] = useState("")
  const [taskError, setTaskError] = useState("")

  const [author, setAuthor] = useState("")
  const [authorError, setAuthorError] = useState("")

  const changeHeight = (e) => {
    e.target.style.height = "auto"
    let height = e.target.scrollHeight
    e.target.style.height = height + "px"
  }
  const titleChangeHandler = (e) => {
    setTitle(e.target.value)
    changeHeight(e)
  }
  const taskChangeHandler = (e) => {
    setTask(e.target.value)
    changeHeight(e)
  }
  const authorChangeHandler = (e) => {
    setAuthor(e.target.value)
    changeHeight(e)
  }

  const validateTitle = (e) => {
    let LengthValidationError = LengthValidator(title, 3, 45) 
    if(LengthValidationError != null) {
      return false
    }
    return true
  }

  const validateTask = (e) => {
    let LengthValidationError = LengthValidator(task, 3, 1500) 
    if(LengthValidationError != null) {
      return false
    }
    return true
  }

  const validateAuthor = (e) => {
    let  NotEmptyValidationError = NotEmptyValidator(task, 3, 1500) 
    if(NotEmptyValidationError != null) {
      return false
    }
    return true
  }

  const buttonClickHandler = (e) => {
    if(validateTitle() && validateTask() && validateAuthor()) {
      sendRequest()
    }
  }

  const sendRequest = () => {
    let data = {
      title,task,author
    }
    dispatch(createTodoThunk({data}))
  }

  useEffect(() => {
     if(status === 'fulfilled') {
      setTitle("")
      setTask("")
      setAuthor("")
      dispatch(clearCreatePopup())
     }
  },[status, dispatch])

  useEffect(() => {
    if(Object.keys(validationErrors).length > 0) {
      for(let i in validationErrors) {
        if(i === "Title") {
          setTitleError(`${validationErrors[i].tag}: ${validationErrors[i].value}`)
          continue
        }
        if(i === "AuthorName") {
          setAuthorError(`${validationErrors[i].tag}: ${validationErrors[i].value}`)
          continue
        }
        if(i === "Task") {
          setTaskError(`${validationErrors[i].tag}: ${validationErrors[i].value}`)
          continue
        }
      }
    }
  }, [validationErrors])

  
  const closeClickHandler = closePopupAreaClickHandler(() => {
    dispatch(closeCreatePopup())
  })

  return (
      <div 
        className={`${popupStyle.popup} ${opened ? popupStyle.active : ""}`}
        onPointerDown={closeClickHandler}
      >
          <div className={`${popupStyle.content}`}>
              <div className={style.container}>
                {status === 'loading' && <Loading width="70px"/>}
                {(status === null || status === 'validation errors') && <>

                  <div className={style.textareaBlock}>
                    <span>Title</span>
                    <textarea 
                      className={style.textarea} 
                      type="text" 
                      value={title} 
                      onChange={titleChangeHandler}/>
                      {titleError && <span className={`${warningsStyle.error} ${style.error}`}>{titleError}</span>}
                  </div>

                  <div className={style.textareaBlock}>
                    <span>Task</span>
                    <textarea 
                      className={style.textarea} 
                      type="text" 
                      value={task} 
                      onChange={taskChangeHandler}/>
                      {taskError && <span className={`${warningsStyle.error} ${style.error}`}>{taskError}</span>}
                  </div>

                  <div className={style.textareaBlock}>
                    <span>Author</span>
                    <textarea 
                      className={style.textarea} 
                      type="text" 
                      value={author}
                      onChange={authorChangeHandler}/>
                      {authorError && <span className={`${warningsStyle.error} ${style.error}`}>{authorError}</span>}
                  </div>

                  <button 
                    className={`${buttonsStyle["button--primary"]} ${style.createButton}`}
                    onClick={buttonClickHandler}
                  >Create</button>
                </>}

                {status === 'rejected' && error && <>{error}</>}
              </div>
          </div>
      </div>
  )
}

export default TodoCreatePopup