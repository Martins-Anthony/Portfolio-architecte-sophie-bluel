let modal = null
let addPicture = false

let token
if (window.localStorage.identify !== undefined) {
    token = JSON.parse(window.localStorage.identify).token
}

const urlServers = {
    category : "http://localhost:5678/api/categories",
    works : "http://localhost:5678/api/works",
}

const optionsDelete = {
    method: 'DELETE',
    headers: {"Authorization": `Bearer ${token}`}
}

async function fetchData(url, option) {
    try {
        let response = await fetch(url, option)
        if (response.ok) {
            return response.json()
        }        
    } catch (error) {
        throw new Error('Impossible de contacter le serveur')
    }
}

/////////////////////////// GET category works /////////////////////////////////

let categoryWorks = window.localStorage.getItem("categoryWorks")
let categoryNameWorks

if (categoryWorks === null) {
    fetchData(urlServers.category).then(data => { 
        window.localStorage.setItem("categoryWorks", JSON.stringify(data))
        categoryWorks = JSON.parse(categoryWorks)
    })
} else if (categoryWorks !== null) {
    if (categoryNameWorks === undefined) {
        categoryNameWorks = JSON.parse(window.localStorage.categoryWorks).map(objet => objet.name) 
    }
}

///////////////////////// GET data works //////////////////////////////////////

let dataWorks = window.localStorage.getItem("dataWork")

fetchData(urlServers.works).then(data => {
    window.localStorage.setItem("dataWork", JSON.stringify(data))
})
if (dataWorks !== undefined) {
    dataWorks = JSON.parse(dataWorks)
}
console.log(dataWorks)
//////////////////////// display works //////////////////////////////////

function posterWorks(data, tag) {
    let arrayItems = [] 
    const classGallery = document.querySelector(tag)
    classGallery.innerHTML = ""
    dataWorks.map(item => { 
        if(item.category.name === data){
            return arrayItems.push(item)
        } else if (data === "Tous") {
            return arrayItems.push(item)
        }
    })
    if (modal !== null) {
        arrayItems = dataWorks
    }
    for (let i = 0; i < arrayItems.length; i++) {
        let containerFigure = document.createElement("figure")
        classGallery.appendChild(containerFigure)      
        if (modal === null) {
            containerFigure.innerHTML =`<img src=${arrayItems[i].imageUrl} alt="${arrayItems[i].title}"><figcaption>${arrayItems[i].title}</figcaption>`
        } else if (modal !== null) {
            containerFigure.innerHTML = `<img class="js-modal-img" data-idPicture="${arrayItems[i].id}" src=${arrayItems[i].imageUrl} alt="${arrayItems[i].title}"><div id="containerTrashIcon"><i class="fa-solid fa-trash-can trashIcon"></i></div>`
        }
    }
}

posterWorks("Tous", ".gallery")

//////////////////////////// Create button category name works ///////////////////////////////////////////////////////////

function createBtnCategoryNameWorks(data) {
    const tagProjetsFilter = document.getElementById("projets")
    tagProjetsFilter.insertAdjacentHTML("afterend",`<div class="filter"></div>`)
    const tagBtnCategoryNameWorks = document.querySelector(".filter")
    let containerClassFilter__btn = ""
    containerClassFilter__btn += `<div class="filter__btn" data-categoryNameWorks="Tous" data-clickActive="true">Tous</div>`
    for (let i = 0; i < data.length; i++) {
        containerClassFilter__btn += `<div class="filter__btn" data-categoryNameWorks="${data[i]}" data-clickActive="false">${data[i]}</div>`
    }
    tagBtnCategoryNameWorks.innerHTML = containerClassFilter__btn
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
        posterWorks(btnCategoryNameWork.dataset.categorynameworks, ".gallery")
    })
})

/////////////////////////////////////////////////////////////////////////////////////// 

function loginBtn() {
    const loginBtn = document.getElementById('login')
    loginBtn.innerHTML = "Logout"

    loginBtn.addEventListener("click", () => {
        window.localStorage.removeItem("identify")
        window.location.reload()
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
////////////////////////////////////// modal //////////////////////////////////////

function openModal(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("arial-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    if (addPicture === false) {
        posterWorks(dataWorks, ".displayOrHideFirstPageModal")
    }
    deletePictureModal()
}

function closeModal(e) {
    e.preventDefault()
    if (modal === null) return 
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
    cleanPageFormModal()
}

function stopPropagation(e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
const modalReturn = document.getElementById("modalReturn")
const modalAddPictureBtn = document.getElementById("modalAddPictureBtn")
const modalAddTitlePicture = document.getElementById("modalAddTitlePicture")
const selectedFormCategory = document.getElementById("modalFormAddCategoryPicture")
const dataCategoryNameWorks = document.querySelectorAll("[data-categoryNameWorks]")
const firstPageModal = document.getElementById("firstPageModal")
const secondPageModal = document.getElementById("secondPageModal")
const modalContainerItemsAddPicture = document.getElementById("modalContainerItemsAddPicture")
const modalFormAddPicture = document.getElementById("modalFormAddPicture")
const modalSendBtn = document.getElementById("modalSendBtn")
const modalFormPicture = document.getElementById('picture')
const imagePreview = document.getElementById('image-preview')

modalAddPictureBtn.addEventListener("click", (event) => {
    event.preventDefault()
    firstPageModal.style.display = "none"
    secondPageModal.style.display = null
    modalReturn.style.display = null
})

modalReturn.addEventListener("click", () => {
    cleanPageFormModal()
})

function cleanPageFormModal() {
    firstPageModal.style.display = null
    secondPageModal.style.display = "none"
    modalReturn.style.display = "none"
    modalFormAddPicture.reset()
    imagePreview.style.display = "none"
    modalContainerItemsAddPicture.style.display = null
    formSubmission()
}
///////////////////////////////// delete pictures modal ////////////////////////////////////////////////

function deletePictureModal() {
    const picturesModal = document.querySelectorAll("img[data-idpicture]")

picturesModal.forEach(img => {
    const idpicture = img.getAttribute("data-idpicture")
    img.addEventListener("click", () => {
        console.log("imgae cliquée avec data-idpicture : ", idpicture)
        fetch(urlServers.works+"/"+idpicture, optionsDelete)
        .then(response => {
            if(response.ok) {
                window.localStorage.removeItem("dataWork")
                alert(`L\'image a été supprimée avec succès.`)
                location.reload()
            } else {
                alert("Erreur lors de la suppression de l\'image.")
            }
        })
        .catch(error => {
            alert("Erreur lors de la suppression de l\'image :", error)
        })
    })
})
}

////////////////////////////////////////////////

const option = document.createElement("option")
option.value 
option.textContent 
selectedFormCategory.appendChild(option)

for (let i = 1; i < dataCategoryNameWorks.length; i++) {
    const valueDataCategoryNameWorks = dataCategoryNameWorks[i].getAttribute("data-categoryNameWorks")
    const option = document.createElement("option")
    option.value = valueDataCategoryNameWorks
    option.textContent = valueDataCategoryNameWorks
    selectedFormCategory.appendChild(option)
}

modalFormPicture.addEventListener('change', function() {
  if (modalFormPicture.files.length > 0) {
    const imageUrl = URL.createObjectURL(modalFormPicture.files[0])
    imagePreview.src = imageUrl
    modalContainerItemsAddPicture.style.display = "none"
    imagePreview.style.display = null
  } else {
    imagePreview.src = ''
    imagePreview.style.display = 'none'
  }
})

///////////////////////////// listen modal form page two ///////////////////////////

function formSubmission() {
    if (modalAddTitlePicture.value && selectedFormCategory.value && modalFormPicture.value) {
        modalSendBtn.removeAttribute("disabled")
        modalSendBtn.style.backgroundColor = "#1D6154"
        console.log(modalFormPicture.files[0])
    } else {
        modalSendBtn.style.backgroundColor = "#A7A7A7"
    }
}

modalAddTitlePicture.addEventListener("input", formSubmission)
selectedFormCategory.addEventListener("input", formSubmission)
modalFormPicture.addEventListener("input", formSubmission)

formSubmission()

/////////////////////////////////////////////////////////////////////////////

modalFormAddPicture.addEventListener("submit", (event) => {
    event.preventDefault()

    const image = modalFormPicture.files[0]
    const title = modalAddTitlePicture.value
    const category = selectedFormCategory.value

    const formData = new FormData()
    formData.append("title", title)
    formData.append("category", category)
    formData.append("image", image)

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {"Authorization": `Bearer ${token}`},
        body:  formData
    })
    .then(response => {
        if(response.ok) {
            window.localStorage.removeItem("dataWork")
            alert(`L\'image a été ajouter avec succès.`)
            location.reload()
        } else {
            alert("Erreur lors de l'ajout de l\'image.")
        }
    })
    .catch(error => {
        alert("Erreur lors de l'ajout de l\'image :", error)
    })
})