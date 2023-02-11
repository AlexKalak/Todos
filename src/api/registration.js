export const registrateQuery = async (jsonData) => {
    let resp = await fetch("http://localhost:9999/auth/registration", {
        method: 'POST',
        headers: {
            'Content-type': "application/json"
        },
        credentials: 'omit',
        body: jsonData
    })

    let body = await resp.json()
    
    // if(!body.ok) {
    //     return {
    //         "ok": false,
    //         "err": body.msg
    //     }
    // }

    if(!body.ok) {
        if(body.validationErrors != null) {
            console.log(body.validationErrors)
            return {
                "ok": false,
                validationErrors: body.validationErrors
            }
        }
        return {
            "ok": false,
            "err": body.msg
        }
    }

    return {
        "ok": true,
        "user": body.user
    }
}