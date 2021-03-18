function getToken(action, key = "6Lca4D8aAAAAABoNbYpThdZYq4ZcyeLEsa10i-RJ") {

    return new Promise((resolve, reject) => {
        if (!window.grecaptcha)
            reject("Recaptcha not set up")

        window.grecaptcha.ready(async () => {
            try {
                let token = await window.grecaptcha.execute(key, { action: action, })

                resolve(token);
            }
            catch (err) {
                reject("Token error")
            }
        });
    })
    
}

export default { getToken }