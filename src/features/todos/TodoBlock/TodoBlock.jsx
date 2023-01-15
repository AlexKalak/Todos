import React, { useRef, useState } from 'react'
import { pointerDownHandler } from './todoSlideHandler'
import style from '../todos.module.scss'
import { useDispatch } from 'react-redux'
import { openEditPopup, openDeletePopup, deleteTodoByID, deleteTodoFromList } from '../todosSlice'
import Loading from '../../../components/Loading/Loading'
import { useEffect } from 'react'


const TodoBlock = (props) => {
    const {todo, isInDeletingProcess, isDeleted} = props
    const [showedAction, setShowedAction] = useState("right")
    const dispatch = useDispatch()
    const todoContainerRef = useRef()

    const rightSideSlideEvent = {                                           
        slideTo: "zero",
        action () {
            dispatch(openDeletePopup({id: todo.id}))
        }
    }
    const leftSideSlideEvent = {
        slideTo: "zero",
        action () {
            dispatch(openEditPopup({id: todo.id}))
        }
    }
    const closeBlock = async (height, time) =>{ 
        let promise = new Promise((res, rej) => {
            if(height <= 0){
                todoContainerRef.current.style.display = "none";
                res()
            }
            setTimeout(async () => {
                height -= 1
                todoContainerRef.current.style.height = height + "px"
                await closeBlock(height, time)
                res()
            }, time)
        })

        await promise
        return
    }
    useEffect(() => {
        if(isInDeletingProcess){ 
            dispatch(deleteTodoByID({id: todo.id}))
            return
        }
        if(isDeleted){
            (async () => {
                let h = todoContainerRef.current.clientHeight
                todoContainerRef.current.style.minHeight = "0px";
                todoContainerRef.current.style.height = h + "px";
                await closeBlock(h, 1500 / h)
                dispatch(deleteTodoFromList({id: todo.id}))
            })()
        }
    })

    let actionsWithSlides = true
    return (
        <article className={style.todoContainer} ref={todoContainerRef}>
            
            {isDeleted && 
            <div 
                className={style.todoProcessing} 
                style ={{fontSize: "25px"}}>😢
            </div>}

            {isInDeletingProcess && 
            <div className={style.todoProcessing}>
                <Loading width="50px"/>
            </div>}
            
            {<>
                <div    
                    style={showedAction === "right" ? {zIndex: "2"} : {zIndex: "1"}}
                    className={style.todoAction + " " + style.todoRightAction}
                >
                    <span>Удалить</span>
                </div>
                <div    
                    style={showedAction === "left" ? {zIndex: "2"} : {zIndex: "1"}} 
                    className={style.todoAction + " " + style.todoLeftAction}
                >
                    <span>Просмотр</span>
                </div>

                <div
                    className={style.todoBlock + " todoBlock"}
                    onPointerDown={
                        actionsWithSlides && !isInDeletingProcess && !isDeleted ? 
                        pointerDownHandler(setShowedAction, rightSideSlideEvent, leftSideSlideEvent)
                        : null
                    }
                >
                    <div style={{pointerEvents: "none"}}>
                        <header className={style.todoHeader}>
                            <div className={style.todoTitle}>{todo.title}</div>
                            <div className={style.todoTime}>{todo.createdtime}</div>
                        </header>
                        
                        <main className={style.todoMain}>
                            <div className={style.todoTask}>{todo.task}</div>
                        </main>

                        <footer className={style.todoFooter}>
                            <div className={style.todoAuthor}>{todo.author}</div>
                        </footer>
                    </div>
                </div>
            </>}
        </article>
    )
}

export default React.memo(TodoBlock)