const idSend = document.getElementById("connection")
const classError = document.querySelector("error")
let displayCheckerEmailError = true
let displayCheckerPasswordError = true

function checkEmail(email) {
    const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    const tagEmail = document.getElementById("email")
    const emailError = document.getElementById("email-error")

    if (emailRegExp.test(email)) {
        if (displayCheckerEmailError === false) {
            emailError.remove()
        }
        displayCheckerEmailError = true
    } else {
        if (displayCheckerEmailError) {
            tagEmail.insertAdjacentHTML("afterend", '<p class="error" id="email-error">E-mail incorrect</p>')
            displayCheckerEmailError = false
        }
    }
}

function checkPassword(password) {
    const passwordRegExp = new RegExp("^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9]).{5,})\\S$")
    const tagPassword = document.getElementById("password")
    const passwordError = document.getElementById("password-error")

    if (passwordRegExp.test(password)) {
        if (displayCheckerPasswordError === false) {
            passwordError.remove()
        }
        displayCheckerPasswordError = true
    } else {
        if (displayCheckerPasswordError) {
            tagPassword.insertAdjacentHTML("afterend", '<p class="error" id="password-error">Mot de passe incorrect au moins 6 caractères une majuscule, une minuscule et un caractère numérique</p>')
            displayCheckerPasswordError = false
        }
    }  
}

idSend.addEventListener("change", () => {
    const tagEmail = document.getElementById("email").value
    const tagPassword = document.getElementById("password").value

    if (tagEmail != "") {
        checkEmail(tagEmail)
    } 
    if (tagPassword != "") {
        checkPassword(tagPassword)
    } 
})


idSend.addEventListener("submit", async (event) => {
    event.preventDefault()
        
    const id = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    }
        
    const payload = JSON.stringify(id)

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "content-Type": "application/json"},
            body: payload
        })
        if (response.ok) {
            window.location.href = "./index.html"
        }

    } catch (error) {
            console.error("Une erreur s'est produite :", error)
    }
        
})

