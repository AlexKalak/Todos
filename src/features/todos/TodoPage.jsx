import React from 'react'
import TodoCreatePopup from './TodoCreatePopup/TodoCreatePopup'
import TodoDeletePopup from './TodoDeletePopup/TodoDeletePopup'
import TodoEditPopup from './TodoEditPopup/TodoEditPopup'
import TodosList from './TodosList'

const TodoPage = () => {
  return (
    <>
        <main>
            <TodosList/>
        </main>
        <TodoEditPopup />
        <TodoDeletePopup />
        <TodoCreatePopup />
    </>
  )
}

export default TodoPage