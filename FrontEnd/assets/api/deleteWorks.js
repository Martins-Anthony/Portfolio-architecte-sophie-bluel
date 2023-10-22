let pictureDeletedOk = false
let idpicture

function deletePictureModal() {
    const picturesModal = document.querySelectorAll("img[data-idpicture]")
    const optionsDelete = {
        method: 'DELETE',
        headers: {"Authorization": `Bearer ${token}`}
    }
    
    picturesModal.forEach(img => {
        img.addEventListener("click", (event) => {       
            idpicture = img.getAttribute("data-idpicture")
            fetch(urlServers.works+"/"+idpicture, optionsDelete)
            .then(response => {
                if(response.ok) {
                    pictureDeletedOk = true
                    alert(`L\'image a été supprimée avec succès.`)
                    pictureDeletedLocalStorage()
                    closeModal(event) 
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

function pictureDeletedLocalStorage() {
    const indexPictureDeleted = dataWorks.findIndex(element => { return element.id === Number(idpicture)})
    if(pictureDeletedOk) {
        if (indexPictureDeleted !== -1) {
            dataWorks.splice(indexPictureDeleted, 1)
        }
        pictureDeletedOk = false
        return localStorage.setItem("dataWork", JSON.stringify(dataWorks))
    }
}
