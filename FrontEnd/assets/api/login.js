const idSend = document.getElementById("connection")

let identifier = window.localStorage.getItem("identify")
let connectionError = false
class userInfo {
    constructor(name,regExp,displayCheck) {
        this.name = name
        this.regExp = regExp
        this.displayCheck = displayCheck
        this.tag = document.getElementById(this.name)
        this.regExpCheck = false     
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
            if (connectionError) {
                const tagSelectemailPasswordRemove = document.getElementById('emailPassword').remove()
                tagSelectemailPasswordRemove
                connectionError = false
            } 
            if (!userInfoTable[i].regExp.test(tagValue)){
                userInfoTable[i].initializeTag()
                userInfoTable[i].regExpCheck = false
            }
            else if (userInfoTable[i].regExp.test(tagValue)){ 
                if (userInfoTable[i].displayCheck) {                   
                    const tagSelectRemove = document.getElementById(`${userInfoTable[i].name}-error`).remove()             
                    userInfoTable[i].displayCheck = false
                    tagSelectRemove
                    
                }   
                userInfoTable[i].regExpCheck = true 
            }
        }    
    }
})

async function fetchLogin(payload) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "content-Type": "application/json"},
        body: payload
    })
    if (response.ok) {
        return response.json()
    } else {
        const displayError = document.getElementById("passwords")
        displayError.insertAdjacentHTML("afterend",`<p class="error" id="emailPassword">E-mail ou Mot de passe incorrect</p>`)
        connectionError = true
        throw new Error('La requête a échoué')
    }
}

idSend.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (userInfoTable[0].regExpCheck && userInfoTable[1].regExpCheck) {
            
        const id = {
           email: userInfoTable[0].tag.value,
           password: userInfoTable[1].tag.value
        }           
        const payload = JSON.stringify(id)
 
        fetchLogin(payload).then(data => {
            window.localStorage.setItem("identify", JSON.stringify(data))
            identifier = JSON.parse(identifier)
            window.location.href = "./index.html"  
        })
    }   
})

