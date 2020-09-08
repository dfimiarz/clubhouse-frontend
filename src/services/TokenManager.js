function getToken() {

    return new Promise((resolve, reject) => {

        const myStorage = window.localStorage;

        if (!myStorage) {
            reject("Local Storage not accessible")
        }
        else {
            const val = myStorage.getItem('_clubtoken')
            resolve(val)
        }
    })

}

function storeToken(token) {

    return new Promise((resolve, reject) => {
        const myStorage = window.localStorage;

        if (!(myStorage)) {
            reject("Local Storage not accessible")
        }
        else {

            try {
                myStorage.setItem('_clubtoken', token)
                resolve()
            }
            catch (err) {
                reject("Unable to write to local storage")
            }

        }
    })

}

function clearToken(){
    return new Promise((resolve, reject) => {
        const myStorage = window.localStorage;

        if (!(myStorage)) {
            reject("Local Storage not accessible")
        }
        else {

            try {
                myStorage.removeItem('_clubtoken')
                resolve()
            }
            catch (err) {
                reject("Unable to clear token")
            }

        }
    })
}



export default {
    getToken,
    storeToken,
    clearToken
}