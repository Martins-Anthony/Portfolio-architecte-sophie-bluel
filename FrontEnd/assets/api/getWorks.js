
const urlServers = {
    category : "http://localhost:5678/api/categories",
    works : "http://localhost:5678/api/works"
}
let dataWorks
let categoryNameWorks

async function getData(url) {
    try {
        const reponse = await fetch(url)

        if (reponse.ok) {
            const data = await reponse.json()
            return data
        } else {
            throw new Error('Erreur lors de la requête GET') 
        }
    } catch (error) {
        alert("Une erreur s'est produite. Veuillez réessayer.")
    }
}

function getDataWorks() {
    dataWorks = window.localStorage.getItem("dataWork")
    getData(urlServers.works).then(data => {
        window.localStorage.setItem("dataWork", JSON.stringify(data))
    })
    return dataWorks = JSON.parse(dataWorks)
}

function getCategoryWorks() {
    let categoryWorks = window.localStorage.getItem("categoryWorks")
 
    getData(urlServers.category).then(data => { 
        window.localStorage.setItem("categoryWorks", JSON.stringify(data))
    })
    categoryWorks = JSON.parse(categoryWorks)
    categoryNameWorks = JSON.parse(window.localStorage.categoryWorks).map(objet => objet.name)
}

getDataWorks()
getCategoryWorks()

