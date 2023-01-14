import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TodoBlock from './TodoBlock/TodoBlock'
import { fetchTodos, selectAllTodos, selectDeletedTodos, selectProcessDeletingIds } from './todosSlice'

import style from './todos.module.scss'
import Loading from '../../components/Loading/Loading'
import TodoButtons from './TodoButtons/TodoButtons'

const TodosList = () => {
    const dispatch = useDispatch()

    const todos = useSelector(selectAllTodos)
    const todosStatuses = useSelector((state) => state.todos.statuses)
    const processDeletingIds = useSelector(selectProcessDeletingIds)
    const deletedTodos = useSelector(selectDeletedTodos)
    const todosErros = useSelector((state) => state.todos.errors)

    const todosJSX = todos.map(todo => {
        console.log(todo.id)
        return <TodoBlock 
                    todo={todo} 
                    isInDeletingProcess={processDeletingIds.includes(todo.id)} 
                    isDeleted={deletedTodos.includes(todo.id)} 
                    key={todo.id}
                />
    })

    

    useEffect(()=>{
        if(todosStatuses.uploading === null) {
            dispatch(fetchTodos())
        }
    },)

    return (
        <section className={style.container}>
            
            <h3>Todos</h3>
            <TodoButtons />
            <div className={style.todoList}>
                {todosStatuses.uploading === "loading" && <Loading width="50px" className={style.loading}/>} 
                {todosStatuses.uploading === "fulfilled" && <>{todosJSX}</>} 
                {todosStatuses.uploading === "failed" && <>{todosErros.uploading}</>} 
            </div>
        </section>
    )
}

export default TodosList