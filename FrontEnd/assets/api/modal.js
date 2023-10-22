function openModal(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("arial-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    addPicture = true
    displayWorks(dataWorks, ".displayOrHideFirstPageModal")
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
    addPicture = false
    displayWorks("Tous", ".gallery")
}

function stopPropagation(e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

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

const option = document.createElement("option")
option.value 
option.textContent 
selectedFormCategory.appendChild(option)

for (let i = 1; i < dataCategoryNameWorks.length; i++) {
    const valueCategoryNameWorks = dataCategoryNameWorks[i].getAttribute("data-categoryNameWorks")
    const valueCategoryIdWorks = dataCategoryNameWorks[i].getAttribute("data-categoryidWorks")
    const option = document.createElement("option")
    option.value = valueCategoryIdWorks
    option.textContent = valueCategoryNameWorks
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