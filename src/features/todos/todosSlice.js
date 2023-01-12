import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { deleteTodo, getTodos } from "../../api/fetchTodos"

const initialState = {
    todos: [],
    processDeletingTodoIds: [],
    currentDeletingId: null,
    deletedTodos: [],
    rejectedDeleteTodos: [],
    statuses: {
        uploading: null
    }, 
    errors: {
        uploading: null
    },
    editPopup: {
        opened: false,
        data: null
    },
    deletePopup: {
        opened: false,
    }
}

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos', 
    async (_, {rejectWithValue}) => {
        try{
            const response = await getTodos()

            if(!response.ok) {
                return rejectWithValue(response.msg)
            }

            return response.data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)
export const deleteTodoByID = createAsyncThunk(
    'todos/deleteTodoById', 
    async ({id}, {rejectWithValue}) => {
        try{
            const response = await deleteTodo(id)

            if(!response.ok) {
                return rejectWithValue({id, err: response.msg})
            }
            return {id}
        } catch (e) {
            return rejectWithValue({id, err: e})
        }
    }
)

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers : {
        openEditPopup(state, action) {
            let { id } = action.payload
            state.editPopup.data = state.todos.find(todo => todo.id === id)
            state.editPopup.opened = true
        },
        closeEditPopup(state, action) {
            state.editPopup.opened = false
        },
        openDeletePopup(state, action) {
            state.currentDeletingId = action.payload.id
            state.deletePopup.opened = true
        },
        closeDeletePopup(state, action) {
            let {accepted} = action.payload
            state.deletePopup.opened = false
            if(accepted) {
                state.processDeletingTodoIds.push(state.currentDeletingId)
            }
            state.currentDeletingId = null
        },
        deleteTodoFromList(state, action) {
            let {id} = action.payload
            state.processDeletingTodoIds = state.processDeletingTodoIds.filter(todoid => todoid !== id)
            state.deletedTodos = state.deletedTodos.filter(todoid => todoid !== id)
            state.todos = state.todos.filter(todoid => todoid !== id)
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.statuses.uploading = 'loading'
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.statuses.uploading = 'fulfilled'
                state.todos = action.payload
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.statuses.uploading = 'failed'
                state.errors.uploading  = action.error.message
            })
            .addCase(deleteTodoByID.fulfilled, (state, action) => {
                let {id} = action.payload;
                state.processDeletingTodoIds = state.processDeletingTodoIds.filter(todoid => todoid !== id)
                state.deletedTodos.push(id)
            })
            .addCase(deleteTodoByID.rejected, (state, action) => {
                let {id} = action.payload
                state.processDeletingTodoIds = state.processDeletingTodoIds.filter(todoid => todoid !== id)
                state.rejectedDeleteTodos.push(id)
            })
    }
})

export default todosSlice.reducer

export const {openEditPopup, closeEditPopup, openDeletePopup, closeDeletePopup, deleteTodoFromList} = todosSlice.actions

export const selectAllTodos = state => state.todos.todos


export const selectProcessDeletingIds = state => state.todos.processDeletingTodoIds
export const selectDeltedTodos = state => state.todos.deletedTodos
export const selectEditPopupData = state => state.todos.editPopup
export const selectDeletePopupData = state => state.todos.deletePopup