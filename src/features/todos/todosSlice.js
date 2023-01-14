import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createTodo, deleteTodo, getTodos } from "../../api/fetchTodos"

const initialState = {
    todos: [],
    processDeletingTodoIds: [],
    currentDeletingId: null,
    deletedTodos: [],
    rejectedDeleteTodos: [],
    statuses: {
        uploading: null,
        creating: null 
    }, 
    errors: {
        uploading: null,
        creatingError: null,
        creatingValidationErrors: {}
    },
    editPopup: {
        opened: false,
        data: null
    },
    deletePopup: {
        opened: false,
    },
    createPopup: {
        opened: true
    }
}

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos', 
    async (_, {rejectWithValue}) => {
        try{
            const response = await getTodos()

            if(!response.ok) {
                return rejectWithValue(response.msg ?? "")
            }

            return response.data
        } catch (e) {
            return rejectWithValue("")
        }
    }
)
export const deleteTodoByID = createAsyncThunk(
    'todos/deleteTodoById', 
    async ({id}, {rejectWithValue}) => {
        try{
            const response = await deleteTodo(id)

            if(!response.ok) {
                return rejectWithValue({id, err: "some error occured"})
            }
            return {id}
        } catch (e) {
            return rejectWithValue({id, err: "some error occured"})
        }
    }
)
export const createTodoThunk = createAsyncThunk(
    'todos/createTodo', 
    async ({data}, {rejectWithValue}) => {
        let json = JSON.stringify(data)
        try{
            const response = await createTodo(json)
            if(!response.ok) {
                return rejectWithValue({validationErrors: response.validationErrors, err: response.err})
            }
            console.log("in thunk", response)
            return {"ok": true, todo: response.todo}
        } catch (e) {
            return rejectWithValue({err: "some error occured"})
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
        },
        openCreatePopup(state, action) {
            state.createPopup.opened = true
        },
        closeCreatePopup(state, action) {
            state.createPopup.opened = false
        },
        clearCreatePopup(state, action) {
            state.statuses.creating = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.statuses.uploading = 'loading'
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.statuses.uploading = 'fulfilled'
                state.todos = action.payload.reverse()
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
            .addCase(createTodoThunk.pending, (state, action) => {
                state.statuses.creating = 'loading'
            })
            .addCase(createTodoThunk.fulfilled, (state, action) => {
                state.statuses.creating = 'fulfilled'
                const {todo} = action.payload
                state.todos = [todo, ...state.todos]
            })
            .addCase(createTodoThunk.rejected, (state, action) => {
                const {validationErrors, err} = action.payload 
                if(validationErrors) {
                    for(let i in validationErrors) {
                        let fieldName = validationErrors[i].FailedField
                        state.errors.creatingValidationErrors[fieldName] = {
                            tag: validationErrors[i].Tag,
                            value: validationErrors[i].Value
                        }
                    }
    
                    state.statuses.creating = 'validation errors'
                    return
                }
                if(err) {
                    state.errors.creatingError = action.payload.err
                    state.statuses.creating = 'failed'
                    return
                }
                state.statuses.creating = 'failed'
                state.errors.creatingError = "some err occured"
            })
    }
})

export default todosSlice.reducer

export const {  openEditPopup, 
                closeEditPopup, 
                openDeletePopup, 
                closeDeletePopup, 
                deleteTodoFromList,
                openCreatePopup,
                closeCreatePopup,
                clearCreatePopup } = todosSlice.actions

export const selectAllTodos = state => state.todos.todos


export const selectProcessDeletingIds = state => state.todos.processDeletingTodoIds
export const selectDeletedTodos = state => state.todos.deletedTodos
export const selectEditPopupData = state => state.todos.editPopup
export const selectDeletePopupData = state => state.todos.deletePopup
export const selectCreatePopupIsOpened = state => state.todos.createPopup.opened