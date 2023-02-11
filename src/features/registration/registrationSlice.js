import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { registrateQuery } from "../../api/registration"

const initialState = {
    status: null,
    error: null,
    validationErrors: null
}

export const registrateThunk = createAsyncThunk(
    'registration/registration',
    async ({data}, {rejectWithValue}) => {
        let jsonData = JSON.stringify(data)
        try {
            let resp = await registrateQuery(jsonData)
            if(!resp.ok) {
                if(resp.validationErrors) {
                    return rejectWithValue({validationErrors: resp.validationErrors})
                }
                return rejectWithValue({err: resp.msg})
            }
            
            return resp.user

        } catch(e) {
            return rejectWithValue({err: e})
        }
    } 
)

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        // redirectToTodos
    },
    extraReducers(builder) {
        builder.addCase(registrateThunk.pending, (state, action) => {
            state.status = 'pending'
            state.error = null
        })
        builder.addCase(registrateThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.error = null
        })
        builder.addCase(registrateThunk.rejected, (state, action) => {
            state.status = 'rejected'
            const { validationErrors, err } = action.payload ?? {}
            if(validationErrors) {
                state.validationErrors = validationErrors
                return
            }

            state.error = err
        })
    }
})

export default registrationSlice.reducer