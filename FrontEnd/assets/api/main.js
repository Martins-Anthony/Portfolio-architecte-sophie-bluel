let modal = null
let addPicture = false
let token
if (sessionStorage.getItem("identify") !== null) {
    token = JSON.parse(sessionStorage.getItem("identify"))
}

/**
 * Displays jobs in an HTML element based on a filter.
 * 
 * @param {number} filterValue 
 * @param {string} tag 
 */
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
        const pictureElement = document.createElement("img")
        pictureElement.src = arrayItems[i].imageUrl
        pictureElement.alt = arrayItems[i].title

        const containerFigure = document.createElement("figure")
        containerFigure.appendChild(pictureElement)

        if (addPicture === true) {
            pictureElement.classList.add("js-modal-img")
            pictureElement.setAttribute("data-idPicture", arrayItems[i].id)

            const trashIconContainer = document.createElement("span")
            trashIconContainer.classList.add("containerTrashIcon")

            const trashIcon = document.createElement("i")
            trashIcon.classList.add("fa-solid", "fa-trash-can", "trashIcon")

            trashIconContainer.appendChild(trashIcon)
            containerFigure.appendChild(trashIconContainer)
        }

        if (addPicture === false) {
            const figcaption = document.createElement("figcaption")
            figcaption.textContent = arrayItems[i].title
            containerFigure.appendChild(figcaption)
        }

        classGallery.appendChild(containerFigure)
    }
}

displayWorks(0, ".gallery")

/**
 * Creates buttons to filter job categories
 * 
 * @param {Array} nameWorks 
 */
function createBtnCategoryNameWorks(nameWorks) {
    const tagProjetsFilter = document.querySelector(".modify-btn")

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