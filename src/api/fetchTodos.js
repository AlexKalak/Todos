import axios from "axios"

const backendDomain = "http://192.168.100.108:9999" 

export const getTodos = async () => {
    const endpoint = `${backendDomain}/todos`

    let response = await axios.get(endpoint)
    console.log(response)
    if(response.statusText !== "OK") {
        return {
            ok: false,
            msg: "some error occured"
        }
    }

    return {
        ok: true,
        data: response.data
    }
}

export const deleteTodo = async (id) => {
    const endpoint = `${backendDomain}/todos/${id}`

    let response = await axios.delete(endpoint)
    console.log(response)
    if(response.statusText !== "OK") {
        return {
            ok: false,
            msg: "something went wrong"
        }
    }

    return {
        ok: true,
        data: response.data
    }
}

export const createTodo = async (todoJSON) => {
    const endpoint = `${backendDomain}/todos`

    let response = await axios.post(endpoint, todoJSON, {
        headers: {
            'Content-Type': 'application/json'}
    })
    console.log("in axios", response)
    if(response.data.ok === false) {
        return {
            ok: false,
            validationErrors: response.data.errors,
            err: response.data.err
        }
    }

    return {
        ok: true,
        todo: response.data.todo
    }
}

export const updateTodo = async (id, todoJSON) => {
    const endpoint = `${backendDomain}/todos/${id}`

    let response = await axios.put(endpoint, todoJSON, {
        headers: {
            'Content-Type': 'application/json'}
    })
    console.log("in axios", response)
    if(response.data.ok === false) {
        return {
            ok: false,
            validationErrors: response.data.errors,
            err: response.data.err
        }
    }

    return {
        ok: true,
        todo: response.data.todo
    }
}