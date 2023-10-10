let filterBtn = document.querySelector(".filter__btn")
let tagFilter = document.getElementById("projets")
tagFilter.insertAdjacentHTML("afterend",`<div class="filter"></div>`)
const tagFilterBtn = document.querySelector(".filter")


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

function posterWorks(data) {
    const classGallery = document.querySelector(".gallery")
    classGallery.innerHTML = " "
    for (let i = 0; i < data.length; i++) {
        let containerFigure = document.createElement("figure")
        classGallery.appendChild(containerFigure)
        containerFigure.innerHTML =
        `<img src=${data[i].imageUrl} alt="${data[i].title}">
        <figcaption>${data[i].title}</figcaption>`  
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
            posterWorks(elements)
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
    posterWorks(data)
    filterWorks(data) 
})


function editMode() {
    let editBar = document.getElementById('edit')
    if (window.localStorage.identify !== undefined) {
        editBar.insertAdjacentHTML("afterbegin" , `<div id="editBar"><i class="fa-regular fa-pen-to-square editIcone"></i><p>Mode édition</p></div>`)
        loginBtn()
        displayFilterRemove()
        modifyBtn()
    }
}

function loginBtn() {
    const loginBtn = document.getElementById('login')
    loginBtn.innerHTML = ""
    loginBtn.innerHTML = "Logout"

    loginBtn.addEventListener("click", () => {
        window.localStorage.removeItem("identify")
        window.location.href = "./index.html"
        console.log(window.localStorage.identify)
    })
}

function displayFilterRemove() {
    tagFilterBtn.style.display = "none"
}

function modifyBtn() {
    const cssIdPortfolio = document.getElementById("portfolio")
    cssIdPortfolio.setAttribute("style", "flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center;")
    tagFilter.insertAdjacentHTML("afterend",`<div class="modifyBtn"><i class="fa-regular fa-pen-to-square editIcone" id="editIconeBtn"></i>modifier</div>`)
    const modifyBtn = document.querySelector(".modifyBtn")
    modifyBtn.addEventListener("click", () => {
        
    })

}

editMode()