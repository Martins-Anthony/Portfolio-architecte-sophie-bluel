let filterBtn = document.querySelector(".filter__btn")
const tagFilter = document.getElementById("projets")
tagFilter.insertAdjacentHTML("afterend",`<div class="filter"></div>`)

function countBtn(data) {
    const nameBtn = ["Tous"]
    data.filter(function (objets) {
         return nameBtn.push(objets.category.name)           
    })
    const uniqueSetName = new Set(nameBtn)
    const uniqueFilterName = [...uniqueSetName]
    return uniqueFilterName 
}

function createFilterButton(dataFilter) {   
    const tagFilterBtn = document.querySelector(".filter")
    const containerDiv= document.createElement("div")
    tagFilterBtn.appendChild(containerDiv)
    containerDiv.innerHTML = dataFilter
    containerDiv.classList.add("filter__btn")
    containerDiv.classList.add(`filter__btn--${dataFilter.replace(/& | /g,'').toLowerCase()}`)
    filterBtn = document.querySelector(".filter__btn")
    filterBtn.classList.add("active")
    return containerDiv
}

function filterBtnActive(num) {
    filterBtn.classList.remove("active")
    filterBtn = document.querySelector(`.filter__btn:nth-child(${num})`)
    filterBtn.classList.add("active")
}

function posterWorks(data, containerClass) {
    const classGallery = document.querySelector(containerClass)
    classGallery.innerHTML = " "
    for (let i = 0; i < data.length; i++) {
        let containerFigure = document.createElement("figure")
        classGallery.appendChild(containerFigure)       
        if (modal === null) {
            containerFigure.innerHTML =`<img src=${data[i].imageUrl} alt="${data[i].title}"><figcaption>${data[i].title}</figcaption>`
        } else if (modal !== null) {
            containerFigure.innerHTML =`<img src=${data[i].imageUrl} alt="${data[i].title}"><div id="containerTrashIcon"><i class="fa-solid fa-trash-can trashIcon"></i></div>`
        }
    }
}

function filterWorks (data) {
    const btn = []
    for (let i = 0; i < countBtn(data).length; i++) {
        btn.push(createFilterButton(countBtn(data)[i]))

        btn[i].addEventListener("click", () => {
            filterBtnActive(i+1)
            const elements = data.filter(function (objet) {
                if (objet.category.id === i) {                       
                    return objet.category.id
                } else if (!objet.category.id == i) {
                    return data
                }
            })
            posterWorks(elements, ".gallery")
        })
    }
}

async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    if (response.ok) {
        return response.json()
    } else {
        throw new Error('Impossible de contacter le serveur')
    } 
}

fetchWorks().then(data => {
    countBtn(data)    
    posterWorks(data, ".gallery")
    filterWorks(data) 
})

function loginBtn() {
    const loginBtn = document.getElementById('login')
    loginBtn.innerHTML = ""
    loginBtn.innerHTML = "Logout"

    loginBtn.addEventListener("click", () => {
        window.localStorage.removeItem("identify")
        window.location.href = "./index.html"
    })
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
    const modifyBtn = document.querySelector(".modifyBtn")
    modifyBtn.addEventListener("click", () => {  
    })
}

function editMode() {
    let editBar = document.getElementById('edit')
    if (window.localStorage.identify !== undefined) {
        editBar.insertAdjacentHTML("afterbegin" , `<div id="editBar"><i class="fa-regular fa-pen-to-square editIcone"></i><p>Mode édition</p></div>`)
        loginBtn()
        displayFilterRemove()
        modifyBtn()
    }
}

editMode()
////////////////////////////////////// modal //////////////////////////////////////
let modal = null
const focusableSelector = "button, a ,input, textarea"
let focusables = []
let previouslyFocusElement = null

function openModal(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusElement = document.querySelector(":focus")
    modal.style.display = null
    focusables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("arial-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    fetchWorks().then(data => {   
        posterWorks(data, ".container")

    })
}

function closeModal(e) {
    e.preventDefault()
    if (modal === null) return
    if (previouslyFocusElement !== null) previouslyFocusElement.focus() 
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("arial-modal")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    const hideModal = function () {
        modal.style.display = "none"
        modal.removeEventListener("animationend", hideModal)           
        modal = null
    }
    modal.addEventListener("animationend", hideModal)
}

function stopPropagation(e) {
    e.stopPropagation()
}

function focusInModal(e) {
    e.preventDefault()   
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal) 
})

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})