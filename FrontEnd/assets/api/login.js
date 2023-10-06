const idSend = document.getElementById("connection")
class userInfo {
    constructor(name,regExp,displayCheck) {
        this.name = name
        this.regExp = regExp
        this.displayCheck = displayCheck
        this.tag = document.getElementById(this.name)     
    }
    initializeTag() {
        if (!this.displayCheck) {
            this.tag.insertAdjacentHTML("afterend",`<p class="error" id="${this.name}-error">${this.name.charAt(0).toUpperCase()+this.name.slice(1)} incorrect</p>`)            
            return this.displayCheck = true       
        }
    }
}

const userInfoTable = [
    userInfoEmail = new userInfo("e-mail", new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+"),false),
    userInfoPassword = new userInfo("passwords", new RegExp("^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9]).{5,})\\S$"),false)
]

idSend.addEventListener("change", () => {
    for (let i = 0; i < userInfoTable.length; i++) {
        const tagValue = userInfoTable[i].tag.value
 
        if (tagValue !== "") {             
            if (!userInfoTable[i].regExp.test(tagValue)){
                userInfoTable[i].initializeTag()
            }
            else if (userInfoTable[i].regExp.test(tagValue)){ 
                if (userInfoTable[i].displayCheck) {
                    const tagSelectRemove = document.getElementById(`${userInfoTable[i].name}-error`).remove()

                    userInfoTable[i].displayCheck = false
                    return tagSelectRemove
                }                      
            } 
        }  
    }
})

idSend.addEventListener("submit", async (event) => {
    event.preventDefault()
        
    const id = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    }
        
    const payload = JSON.stringify(id)

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "content-Type": "application/json"},
        body: payload
    }).then(response => {
        if (response.ok) {
            window.location.href = "./index.html"
        } else {
            const displayError = document.getElementById("passwords")
            displayError.insertAdjacentHTML("afterend",`<p class="error">E-mail ou Mot de passe incorrect</p>`)
        }
    })
    
})

