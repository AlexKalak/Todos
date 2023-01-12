import axios from "axios"

export const getTodos = async () => {
    const endpoint = "http://localhost:9999/todos"

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
    const endpoint = `http://localhost:9999/todos/${id}`

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