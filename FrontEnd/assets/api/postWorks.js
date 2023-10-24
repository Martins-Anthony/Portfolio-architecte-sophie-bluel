function formSubmission() {
    if (modalAddTitlePicture.value && selectedFormCategory.value && modalFormPicture.value) {
        modalSendBtn.removeAttribute("disabled")
        modalSendBtn.style.backgroundColor = "#1D6154"
        cursorSendBtn.style.cursor = "pointer"
    } else {
        modalSendBtn.style.backgroundColor = "#A7A7A7"
        cursorSendBtn.style.cursor = "auto"    
    }
}

const cursorSendBtn = document.getElementById("modalSendBtn")
modalAddTitlePicture.addEventListener("input", formSubmission)
selectedFormCategory.addEventListener("input", formSubmission)
modalFormPicture.addEventListener("input", formSubmission)

formSubmission()

modalFormAddPicture.addEventListener("submit", (event) => {
    event.preventDefault()
    
    const image = modalFormPicture.files[0]
    const title = modalAddTitlePicture.value
    const category = selectedFormCategory.value
    
    const formData = new FormData()
    formData.append("title", title)
    formData.append("category", category)
    formData.append("image", image)

    postData(urlServers.works, formData).then(data => {
        dataWorks.push(data)
        localStorage.setItem("dataWork", JSON.stringify(dataWorks))
        closeModal(event)
    })
})

async function postData(url, bodyData) {
    
    try {
        const reponse = await fetch(url, {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`},
            body:  bodyData
        })

        if (reponse.ok) {
            const data = await reponse.json()
            alert(`L\'image a été ajouté avec succès`)
            return data
        } else {
            throw new Error('Erreur lors de la requête POST') 
        }
    } catch (error) {
        alert("Une erreur s'est produite. Veuillez réessayer.")
    }
}

