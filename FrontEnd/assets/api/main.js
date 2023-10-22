let modal = null
let addPicture = false

let token
if (window.localStorage.identify !== undefined) {
    token = JSON.parse(window.localStorage.identify).token
}

function displayWorks(filterValue, tag) {
    
    let arrayItems = [] 
    const classGallery = document.querySelector(tag)
    classGallery.innerHTML = ""
    arrayItems = dataWorks.filter(item => { 
        return filterValue === 0 || item.categoryId === filterValue
    })
    
    if (modal !== null) {
        arrayItems = dataWorks
    }

    for (let i = 0; i < arrayItems.length; i++) {
        let containerFigure = document.createElement("figure")
        classGallery.appendChild(containerFigure)      
        if (addPicture === false) {
            containerFigure.innerHTML =`<img src=${arrayItems[i].imageUrl} alt="${arrayItems[i].title}"><figcaption>${arrayItems[i].title}</figcaption>`
        } else if (addPicture === true) {
            containerFigure.innerHTML = `<img class="js-modal-img" data-idPicture="${arrayItems[i].id}" src=${arrayItems[i].imageUrl} alt="${arrayItems[i].title}"><span class="containerTrashIcon"><i class="fa-solid fa-trash-can trashIcon"></i></span>`
        }
    }  
}

displayWorks(0, ".gallery")

/**
 * Creates buttons to filter job categories
 * 
 * @param {Array} nameWorks 
 */
function createBtnCategoryNameWorks(nameWorks) {
    const tagProjetsFilter = document.getElementById("projets")

    const filterElement = document.createElement("div")
    filterElement.className = "filter"

    const allButton = createCategoryButton(0, "Tous", true)
    filterElement.appendChild(allButton)

    for (let i = 0; i < nameWorks.length; i++) {
        const categoryButton = createCategoryButton(i + 1, nameWorks[i], false)
        filterElement.appendChild(categoryButton)
    }

    tagProjetsFilter.insertAdjacentElement("afterend", filterElement)
}

function createCategoryButton(categoryId, categoryName, clickActive) {
    // Create a button with specific attributes
    const button = document.createElement("div")
    button.className = "filter__btn"
    button.setAttribute("data-categoryIdWorks", categoryId)
    button.setAttribute("data-categoryNameWorks", categoryName)
    button.setAttribute("data-clickActive", clickActive)

    // Sets the button text as the category name
    button.textContent = categoryName

    return button
}

createBtnCategoryNameWorks(categoryNameWorks)

/////////////////////// Selected button category + add clic and style css ///////////////////////////////////////

const btnCategoryAllWorks = document.querySelector(".filter__btn[data-clickactive='true'")
btnCategoryAllWorks.style.backgroundColor = "#1D6154"
btnCategoryAllWorks.style.color = "#FFF"

const btnCategoryNameWorks = document.querySelectorAll('.filter__btn')

btnCategoryNameWorks.forEach(btnCategoryNameWork => {
    btnCategoryNameWork.addEventListener("click", () => {
        btnCategoryNameWorks.forEach(b => {
            b.setAttribute("data-clickactive", "false")
            b.style.backgroundColor = ""
            b.style.color = "#1D6154"
        })
        btnCategoryNameWork.setAttribute("data-clickactive", "true")
        btnCategoryNameWork.style.backgroundColor = "#1D6154"
        btnCategoryNameWork.style.color = "#FFF"
        displayWorks(Number(btnCategoryNameWork.dataset.categoryidworks), ".gallery")
    })
})
 
function loginBtn() {
    const loginBtn = document.getElementById('login')
    loginBtn.innerHTML = "Logout"

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
    window.localStorage.removeItem("identify")
    window.localStorage.removeItem("dataWork")
    window.localStorage.removeItem("categoryWorks")
}

function displayFilterRemove() {
    const tagFilterBtn = document.querySelector(".filter")
    tagFilterBtn.style.display = "none"
}

function modifyBtn() {
    const tagFilter = document.getElementById("projets")
    const cssIdPortfolio = document.getElementById("portfolio")
    cssIdPortfolio.setAttribute("style", "flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center;")
    tagFilter.insertAdjacentHTML("afterend",`<div class="modifyBtn"><i class="fa-regular fa-pen-to-square editIcone" id="editIconeBtn"></i><a href="#modal1" class="js-modal">modifier</a></div>`) 
}

function editMode() {
    let editBar = document.getElementById('edit')
    if (token !== undefined) {
        editBar.insertAdjacentHTML("afterbegin" , `<div id="editBar"><i class="fa-regular fa-pen-to-square editIcone"></i><p>Mode édition</p></div>`)
        loginBtn()
        displayFilterRemove()
        modifyBtn()
    }
}

editMode()