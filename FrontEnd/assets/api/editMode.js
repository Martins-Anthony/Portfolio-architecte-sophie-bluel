const editBar = document.getElementById("edit-mode-bar")
const portfolio = document.getElementById("portfolio")
const tagFilterBtn = document.querySelector(".filter")
const modifyButton = document.querySelector(".modify-btn")
const loginBtn = document.getElementById('login')

function addEditMode() {
    if (token !== undefined) {
        editBar.style.display = "flex"
        portfolio.style.display = "flex"
        modifyButton.style.display = "block"
        tagFilterBtn.style.display = "none"
        toggleLoginState()
    } else {
        editBar.style.display = "none"
        portfolio.style.display = "block"
        modifyButton.style.display = "none"
    }
}

function toggleLoginState() {   
    loginBtn.innerHTML = "logout"

    loginBtn.addEventListener("click", () => {        
        refreshesLocalStorageWorks()
        setTimeout(function() {
            window.location.reload()
        }, 100)
    })
}

function refreshesLocalStorageWorks() {
    getDataWorks()
    getCategoryWorks()
    window.sessionStorage.removeItem("identify")
    window.localStorage.removeItem("dataWork")
    window.localStorage.removeItem("categoryWorks")
}

addEditMode()