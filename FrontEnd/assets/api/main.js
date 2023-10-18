let modal = null
let addPicture = false
/*
function reloadPageError() {
    const reloadPage = document.getElementById("reloadPage")
    reloadPage.addEventListener("click", () => {
        console.log('test click 1')
        window.location.href = "./index.html"
        fetchData(urlServers.works)
        console.log('test click 2')
    })
}
*/
const urlServers = {
    category : "http://localhost:5678/api/categories",
    works : "http://localhost:5678/api/works",
}

let token
if (window.localStorage.identify !== undefined) {
    token = JSON.parse(window.localStorage.identify).token
}

const optionsDelete = {
    method: 'DELETE',
    headers: {"Authorization": `Bearer ${token}`}
}

function customFetch(url, type, data) {
    
    let header
    let corp
    if (type === "GET") {
        header = {"Content-type": "application/json"} 
    } else if (type === "POST") {
        header = {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${JSON.parse(window.localStorage.identify).token}`}
        corp = {body: JSON.stringify({data})}
    }
    else if (type === "DELETE") {
        header = {"Authorization": `Bearer ${JSON.parse(window.localStorage.identify).token}`}
    }
    
    return fetch(url, {
        method: type,
        headers: header,
        corp    
    })
    .then((response) => {
        if (type === "DELETE") { return }
        else if (response.ok) { return response.json() }
    })       
    .then((data) => {
        if (type === "DELETE") { return }
        console.log(data, 'test data')})
    .catch((error) => console.log(error))
     
}

//customFetch(urlServers.works, "POST")

async function fetchData(url) {
    try {
        let response = await fetch(url)
        if (response.ok) {
            return response.json()
        }        
    } catch (error) {
        console.log('test error')
        const deletePage = document.getElementById("edit")
        deletePage.innerHTML = `<div id="errorServer"><h1>Cette page ne fonctionne pas</h1><p>Si le problème persiste. Contacter le propriétaire du site.</p><br><div id="spaceBetween">${error}<button id="reloadPage">Réactualiser la page</button></div></div>`       
        reloadPageError()
        throw new Error('Impossible de contacter le serveur')
    }
}

/////////////////////////// Call category works /////////////////////////////////

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

///////////////////////// Call data works //////////////////////////////////////

let dataWorks = window.localStorage.getItem("dataWork")

if(dataWorks === null) {
    fetchData(urlServers.works).then(data => {
        window.localStorage.setItem("dataWork", JSON.stringify(data))   
    })
} else {
    dataWorks = JSON.parse(dataWorks)
}

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
            modalPicturesGallery(containerFigure, arrayItems, i)
        }
    }
}
console.log(dataWorks, 'check data')
posterWorks("Tous", ".gallery")
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function modalPicturesGallery(container, array, index) {
    container.innerHTML = `<img class="js-modal-img" data-idPicture="${array[index].id}" src=${array[index].imageUrl} alt="${array[index].title}"><div id="containerTrashIcon"><i class="fa-solid fa-trash-can trashIcon"></i></div>`
}






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
        window.localStorage.removeItem("dataWork")
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
    addPicture = false
    modalReturn.style.display = "none"
    firstPageModal.style.display = null
    secondPageModal.style.display = "none"
    modalContainerItems.removeAttribute("id","modalContainerItemsAddPicture")
}

function stopPropagation(e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
const modalReturn = document.getElementById("modalReturn")
const modalSendBtn = document.getElementById("modalSendBtn")
const modalContainerItems = document.querySelector(".modalContainerItems")
const modalTile = document.getElementById("titleModal")
const modalForm = document.getElementById("modalForm")
//const tagsAddPicture = `<span><i class="fa-regular fa-image"></i></span><label for="picture" id="modalAddPictureBtn">+ Ajouter Photo</label><input id="picture" name="picture" type="file" accept="images/*" required title="+ Ajouter Photo"><img id="image-preview" src="" alt="Aperçu de l'image" style="max-width: 100%; display: none;"><p>jpg, png : 4mo max</p>`
const tagsformAddTitleCategory = document.getElementById("formAddTitleCategory")
const dataCategoryNameWorks = document.querySelectorAll("[data-categoryNameWorks]")
const SelectedFormCategory = document.getElementById("modalFormAddCategoryPicture")
//////
const firstPageModal = document.getElementById("firstPageModal")
const secondPageModal = document.getElementById("secondPageModal")
const modalContainerItemsAddPicture = document.getElementById("modalContainerItemsAddPicture")
const modalFormAddPicture = document.getElementById("modalFormAddPicture")
//////

modalSendBtn.addEventListener("click", (event) => {
    event.preventDefault()
    firstPageModal.style.display = "none"
    secondPageModal.style.display = null
    modalReturn.style.display = null
})

modalReturn.addEventListener("click", () => {
    firstPageModal.style.display = null
    secondPageModal.style.display = "none"
    modalReturn.style.display = "none"
    modalFormAddPicture.reset()
    imagePreview.style.display = "none"
    modalContainerItemsAddPicture.style.display = null
})

const option = document.createElement("option")
option.value 
option.textContent 
SelectedFormCategory.appendChild(option)

for (let i = 1; i < dataCategoryNameWorks.length; i++) {
    const valueDataCategoryNameWorks = dataCategoryNameWorks[i].getAttribute("data-categoryNameWorks")
    const option = document.createElement("option")
    option.value = valueDataCategoryNameWorks
    option.textContent = valueDataCategoryNameWorks
    SelectedFormCategory.appendChild(option)
}

const inputPicture = document.getElementById('picture');
const imagePreview = document.getElementById('image-preview');
console.log(inputPicture)
// Écoutez les changements dans le champ de fichier
inputPicture.addEventListener('change', function() {
  // Vérifiez si un fichier a été sélectionné
  if (inputPicture.files.length > 0) {
    // Obtenez l'URL de l'image sélectionnée
    const imageUrl = URL.createObjectURL(inputPicture.files[0]);

    // Affichez l'image dans l'aperçu
    imagePreview.src = imageUrl;
    modalContainerItemsAddPicture.style.display = "none"
    imagePreview.style.display = null;
  } else {
    // Masquez l'aperçu si aucun fichier n'est sélectionné
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }
});

