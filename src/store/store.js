import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "../features/registration/registrationSlice";
import todosReducer from "../features/todos/todosSlice";

export const store = configureStore({
    reducer: {
        todos: todosReducer,
        registration: registrationReducer
    }
})