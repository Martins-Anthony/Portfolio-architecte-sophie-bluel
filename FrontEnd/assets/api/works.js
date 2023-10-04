
let containerFigure = document.createElement("figure")
let filterBtn = document.querySelector(".filter__btn")

const classGallery = document.querySelector(".gallery")
const btn = [
    document.querySelector(".filter__btn--all"),
    document.querySelector(".filter__btn--objets"),
    document.querySelector(".filter__btn--apartment"),
    document.querySelector(".filter__btn--hotels"),
]

function filterBtnActive(num) {
    filterBtn.classList.remove("active")
    filterBtn = document.querySelector(`.filter__btn:nth-child(${num})`)
    filterBtn.classList.add("active")
}

function posterWorks(data) {
    classGallery.innerHTML = " "
    for (let i = 0; i < data.length; i++) {
        containerFigure = document.createElement("figure")
        classGallery.appendChild(containerFigure)
        containerFigure.innerHTML =
        `<img src=${data[i].imageUrl} alt="${data[i].title}">
        <figcaption>${data[i].title}</figcaption>`  
    }
}

fetch(`http://localhost:5678/api/works`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Impossible de contacter le serveur')
        }
        return response.json()
    })
    .then(data => {
        
        posterWorks(data)

        for (let i = 0; i < btn.length; i++) {
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
    })







