import axios from "axios"

export const sendDeleteQuery = async (id) => {
    let response = await axios.get("http://localhost:9999")
    if(response.data.ok) {
        return true     
    }
    return response.data.msg
}