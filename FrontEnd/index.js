const api = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
let categoryIdValue = "";
let categories = []; 
let btnTitle = [];
const btnSort = document.querySelectorAll(".btn");
const filterButtons = document.createElement("div");
const portfolioSection = document.querySelector("#portfolio");
portfolioSection
  .querySelector("h2")
  .insertAdjacentElement("afterend", filterButtons);
const imageUrls = [];
//route Works

fetch("http://localhost:5678/api/works")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    console.log(value);
    for(let i=0; i<value.length; i++)
     {
       console.log(value[i].imageUrl)
    }
  })
  .catch(function(err) {
    // Une erreur est survenue
  });
  
async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    const btnTitle = getButtonTitles(cards);
    console.log(`le titre des BTN filtres  : ${btnTitle.join("  /  ")}`);
    console.log(cards);
    filtersBtn(btnTitle);
    workDisplay(cards);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

// route Categories
async function fetchApiCategories() {
  try {
    await fetch(api + "categories")
      .then((res) => res.json())
      .then((data) => (categories = data));
    console.log(categories);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}


function getButtonTitles(cards) {
  return [...new Set(cards.map((card) => card.category.name))];
}


function filtersBtn(btnTitle) {

  const allButton = document.createElement("button");
  allButton.classList.add("btn", "active");
  allButton.textContent = "Tous";
  filterButtons.appendChild(allButton);
  filterButtons.classList.add("filter");

  

  const buttons = [
    allButton,
    ...btnTitle.map((categoryName) => {
      const button = document.createElement("button");
      button.classList.add("btn");
      button.textContent = categoryName;
      filterButtons.appendChild(button);
      return button;
    }),
  ];

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      categoryIdValue = e.target.textContent;
      console.log(categoryIdValue);
      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      workDisplay();
    });
  });
}

//CREATION CARTES WORKS

function cardsTemplate(card) {
  const cardDisplay = document.createElement("figure");
  
  cardDisplay.setAttribute("data-card-id", card.id);
  cardDisplay.setAttribute("value", card.categoryId);
  

  const imgCard = document.createElement("img");
  imgCard.setAttribute("src", card.imageUrl);
  imgCard.setAttribute("alt", "photo de " + card.title);


  const titleCard = document.createElement("figcaption");
  titleCard.textContent = card.title;

  cardDisplay.appendChild(imgCard);
  cardDisplay.appendChild(titleCard);
  portfolioSection.appendChild(cardDisplay);


  return cardDisplay;
}


function workDisplay() {
  const gallery = document.querySelector(".gallery");
  const cardDisplay = new Set();
  gallery.innerHTML = "";
  cards.forEach((card) => {
    if (categoryIdValue === "Tous" || card.category.name === categoryIdValue) {
      cardDisplay.add(card);
    }
  });
  cardDisplay.forEach((card) => {
    gallery.appendChild(cardsTemplate(card));
  });
}


window.addEventListener("load", (e) => {
  fetchApiWorks();
  fetchApiCategories();
  categoryIdValue = "Tous";
  checkToken();
});

//partie ADMIN
function checkToken() {
  // Vérifie si le token est dans le localStorage
  const token = localStorage.getItem("token");
  if (token) {
    
    console.log("token present dans le local storage , mode admin ACTIVÉ");
    adminEdition();
  } else {
    console.log("Pas de token dans le local storage , mode admin DESACTIVÉ");
   
  }
}

//LOG OUT a la fermeture onglet donc suppresion du token
function removeToken() {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
  sessionStorage.removeItem("deletedImages");
}

//événement fermeture onglet ou redirection vers un autre site
window.addEventListener("unload", removeToken);

// *****************************DOM QUI PASSE EN MODE ADMIN EDITOR  

function adminEdition() {
  adminHTML();
  //*************************************OPEN 1ER MODAL EDIT SUPRESSION

  const modalJs = document.getElementById("titleProjectRemove");

  modalJs.addEventListener("click", (e) => {
    e.preventDefault();
    modalHTML();
    displayModal();
    openModal();
    editModal();
  });
  //*************************************SUPRESSION DES TRAVAUX DE L'API
  const deleteWorksApi = document.querySelector("body > div > button");
  //Confirmation DELETE CARTES dans L'API
  deleteWorksApi.addEventListener("click", (e) => {
    e.preventDefault();
    functionDeleteWorksApi();
  });
}
//*************************************AUTRE FONCTION DU MODE ADMIN
const adminHTML = () => {
  //*************************************PARTIE SITE AVEC AJOUT DES ELTMTS EDITOR SUR DOM
 

  //*************************************Créer le bandeau Admin Editor
  const flagEditor = document.createElement("div");
  flagEditor.classList.add("flagEditor");
  document
    .querySelector("body")
    .insertAdjacentElement("afterbegin", flagEditor);

  const spanFlagEditor = document.createElement("span");
  spanFlagEditor.classList.add("projectRemove");
  spanFlagEditor.textContent = "Mode édition";

  //*************************************Créer Le SPAN avec le "i"
  const iconFlagEditor = document.createElement("i");
  iconFlagEditor.className = "fa-regular fa-pen-to-square";

  //*************************************Insérer l'élément i parent avant le texte de span
  spanFlagEditor.insertBefore(iconFlagEditor, spanFlagEditor.firstChild);

  const btnFlagEditor = document.createElement("button");
  btnFlagEditor.textContent = "publier les changements";

  flagEditor.appendChild(spanFlagEditor);
  flagEditor.appendChild(btnFlagEditor);

  //*************************************Pointage des position à injecter
  const figure = document.querySelector("#introduction figure");
  const titleProject = document.querySelector("#portfolio > h2");

  //*************************************clonage du Span au dessus! true = Mm enfant aussi
  //SPAN "Mode édition" en dessou de Sophie
  const spanFigure = spanFlagEditor.cloneNode(true);
  spanFigure.classList.remove("projectRemove");
  spanFigure.classList.add("figureRemove");
  //SPAN "Mode édition" des Projets
  const spanTitleProject = spanFlagEditor.cloneNode(true);
  spanTitleProject.classList.remove("projectRemove");
  spanTitleProject.setAttribute("id", "titleProjectRemove");

  //*************************************INJECTION  SPAN
  figure.appendChild(spanFigure);
  titleProject.appendChild(spanTitleProject);

  //*************************************
  //************************************* Login -> Logout HTML
  //*************************************

  // Sélectionner le <li> pour logout
  const logout = document.querySelector(
    "body > header > nav > ul > li:nth-child(3)"
  );

  // Créer un élément <a> pour le lien de déconnexion logout au lieu de login
  const logoutLink = document.createElement("a");
  logoutLink.href = "./index.html";

  const logoutText = document.createTextNode("logout");
  logoutLink.appendChild(logoutText);

  logout.innerHTML = "";
  logout.appendChild(logoutLink);

  //  deconnexion
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    removeToken();
    window.location.assign("./index.html");
  });

  //*************************************Ajout class pour mieux intégrer le FlagEditor 
  document.body.classList.add("marginTop");

  //*************************************Delete les filtres de Recherche HTML pendant le mode admin
  filterButtons.remove();
};
function openModal() {
  let deletedImages = {};
  //evitez les doublettes images Gallery
  document.getElementById("modalGrid").innerHTML = "";

  //*************************************INJECTION DES ELEMENTS FETCHER
  // Récupérer les liens des images
  // mnouveau tableau
  const imagesUrl = [...document.querySelectorAll(".gallery img")].map((img) =>
    img.getAttribute("src")
  );

  // Créer un Set pour n'avoir que des liens uniques
  const imagesUrlSet = new Set(imagesUrl);

  //*************************************INJECTIONS DES CARTES DS MODAL
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const imageElements = [...imagesUrlSet].map((link, index) => {
    const container = document.createElement("figure");
    const img = document.createElement("img");
    const p = document.createElement("p");
    const iconDelete = document.createElement("i");

    // ajouter l'attribut data-card-id
    container.setAttribute("data-card-id", cards[index].id);
    iconDelete.id = "deleteIcon";
    iconDelete.classList.add("fa-solid", "fa-trash-can", "iconModal");
    iconDelete.setAttribute("aria-hidden", "true");
    img.src = link;
    p.textContent = "éditer";
    container.appendChild(img);
    container.appendChild(p);
    container.appendChild(iconDelete);

    // Ajouter l'icône de déplacement uniquement sur le premier élément
    if (index === 0) {
      const iconMove = document.createElement("i");
      iconMove.id = "moveIcon";
      iconMove.classList.add(
        "fa-solid",
        "fa-arrows-up-down-left-right",
        "iconModal"
      );
      container.appendChild(iconMove);
    }

    //DELETE icone Corbeille
    iconDelete.addEventListener("click", async (e) => {
      e.preventDefault();
      const cardDelete = e.target.parentNode.getAttribute("data-card-id");
      removeElement(cardDelete);
      deletedImages[cardDelete] = true;
      console.log(deletedImages);

      // Convertir l'objet en chaîne de caractères JSON
      const deletedImagesJSON = JSON.stringify(deletedImages);
      // Stocker JSON dans sessionStorage
      sessionStorage.setItem("deletedImages", deletedImagesJSON);
    });

    //FONCTION DELETE SUR LE DOM UNIQUEMENT appellé ds l evenement au click delete:

    function removeElement(cardDelete) {
      const card = document.querySelector(`[data-card-id="${cardDelete}"]`);
      if (card && card.parentNode) {
        card.parentNode.removeChild(card);
        container.remove(card);
      }
    }

    //FONCTION DELETE ALL DU DOM DEPUIS MODAL
    const deleteALL = document.querySelector("#deleteAllWorks");
    deleteALL.addEventListener("click", () => {
      const figureModals = document.querySelectorAll("#modalGrid figure");
      const galleryModals = document.querySelectorAll("#portfolio figure");
      const deletedImages =
        JSON.parse(sessionStorage.getItem("deletedImages")) || {};
      const imageIds = [];

      figureModals.forEach((figure) => {
        const dataCardId = figure.getAttribute("data-card-id");
        imageIds.push(dataCardId);
        // stocke l'ID deletedImages
        deletedImages[dataCardId] = true;
      });

      // DELETE TOUTES LES CARTES
      figureModals.forEach((figure) => figure.remove());
      galleryModals.forEach((figure) => figure.remove());

      // Stocke les ID SESSIONTORAGE
      sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
    });
    return container;
  });

  const galleryMap = document.getElementById("modalGrid");
  galleryMap.append(...imageElements);
}
const functionDeleteWorksApi = () => {
  // Récupérer la chaîne de sessionStorage
  const deletedImagesJSON = sessionStorage.getItem("deletedImages");
  // Convertir la chaîne en objet JavaScript
  const deletedImages = JSON.parse(deletedImagesJSON);
  // Supprimer chaque image du SESSION STORAGE
  //méthode JavaScript qui renvoie un tableau contenant les clés d'un objet
  Object.keys(deletedImages).forEach(async (id) => {
    try {
      if (token === false) return console.log({ error: "Pas connecté" });

      const response = await fetch(`${api}works/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log(`Image avec ID ${id} supprimée`);
      } else {
        throw new Error(response.statusText);
      }
    } catch (e) {
      console.error(
        `Erreur lors de la suppression de l'image avec ID ${id}: ${e}`
      );
    }
  });
};
// *****************************************************************************************************
//**********************************  AFFICHAGE DE LA MODAL  *******************************************
// *****************************************************************************************************
function editModal() {
  const addProject = document.getElementById("editModal");
  const inputFile = document.getElementById("filetoUpload");
  const selectCategory = document.getElementById("category");
  const editSection = document.querySelector("#editSection");
  const addToApi = document.getElementById("editWorks");
  const gallerySection = document.querySelector("#modalEdit");
  const previewModal = document.querySelector("#previewModal");
  let iCanSubmit = false;

  //*************************************Cache - Cache differentes section Modale
  addProject.addEventListener("click", () => {
    gallerySection.style.display = "none";
    editSection.style.display = "";
    previewModal.style.display = "initial";
  });

  previewModal.addEventListener("click", () => {
    gallerySection.style.display = "";
    editSection.style.display = "none";
    previewModal.style.display = "none";
  });

  //*************************************PARTIE IMG
  inputFile.addEventListener("change", addPicture);

  //*************************************PARTIE CATEGORIE

  // Utiliser les données de l'API du 2e Fetch pour générer les options de l'élément select

  if (selectCategory.options.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "";
    selectCategory.appendChild(emptyOption);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.textContent = category.name;
      option.setAttribute("data-id", category.id);
      selectCategory.appendChild(option);
    });
  }
  //************************************* Condition Formulaire POST

  editSection.addEventListener("input", () => {
    const editTitle = document.querySelector("#title");
    const errorImg = document.getElementById("errorImg");
    const titleError = document.querySelector("#ErrorTitleSubmit");
    const categoryError = document.querySelector("#ErrorCategorySubmit");
    const submitForm = document.querySelector(
      "#editWorks > div.footerModal.editFooter > input[type=submit]"
    );
    iCanSubmit = false;
    titleSelected = false;
    categorySelected = false;
    submitForm.style.background = " grey";
    let category = document.querySelector("#category").value;
    const title = editTitle.value;
    const image = inputFile.files[0];
    // console.log(typeof image);

    if (image === null || image === undefined) {
      errorImg.textContent = "Veuillez selectionnez une image";
      imageSelected = false;
    } else if (title.length < 1) {
      titleError.textContent = "Ajoutez un titre";
      titleSelected = false;
    } else if (category === "") {
      categoryError.textContent = "Choisissez une catégorie";
      titleError.textContent = "";
      categorySelected = false;
    } else {
      //submitForm.style.background = " #1d6154";
      titleError.textContent = "";
      categoryError.textContent = "";
      categorySelected = true;
      titleSelected = true;
      imageSelected = true;

      
    }
    if (titleSelected && categorySelected && imageSelected) {
      submitForm.style.background = " #1d6154";
      iCanSubmit = true;
    }
  });

  addToApi.addEventListener("submit", (e) => {
    e.preventDefault();
    //*************************************Récupérer les valeurs INPUTs en admin
    if (iCanSubmit) {
      //Récupérer image
      const image = inputFile.files[0];

      //Récupérer Titre
      const title = document.querySelector("#title").value;

      //Récupérer id du fetch Category depuis la liste
      let categorySelect = document.querySelector("#category");
      let selectedOption = categorySelect.selectedOptions[0];
      let category = selectedOption.getAttribute("data-id");
      category = parseInt(category);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("category", category);
      //console.log(formData);

      fetch(api + "works", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("votre requête POST n'est pas passé ");
          }
          return response.json();
        })
        .then((data) => {
          console.log("votre requête POST est passé :", data);
          fetchApiWorks();
          workDisplay();
          closeModal();

          inputFile.value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
          console.log("Ta requête POST n'est PAS passée :( ");
        });
    } else {
      console.log("Formulaire invalide !!!");
    }
  });
}

///// manque constante pour ajout et suppression de photo derniere fonction normalement avec msg erreur max 4mo pour ajout photo

function disableScroll() {
  document.body.classList.add("modalOpen");
}

function enableScroll() {
  document.body.classList.remove("modalOpen");
}

function displayModal() {
  const modal = document.querySelector("#modal");
  const closeModalBtn = document.querySelector("#closeModal");
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  disableScroll();
}
function closeModal() {
  document.getElementById("modal").remove();
  enableScroll();
}
const modalHTML = () => {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <aside id="modal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-hidden="true" display="initial">

    <div id="modalContainer">

      <i id="closeModal" class="fa-solid fa-xmark"></i>
      <i id="previewModal" class="fa-solid fa-arrow-left "></i>

      <!-- GALERIE PHOTO -->
      <section class="modalTemplate" id="modalEdit">


        <div id="editionGallery">
          <h2 class="modalTitle">Galerie photo</h2>
          <!-- <i id="deleteIcon" class="fa-solid fa-trash-can iconModal"></i>
          <i id="moveIcon" class="fa-solid fa-arrows-up-down-left-right iconModal"></i> -->
          <div id="modalGrid">
          </div>
        </div>
        <div class="footerModal">
          <hr>
          <input type="submit" value="Ajouter une photo" id="editModal">
          <p id="deleteAllWorks">Supprimer la galerie</p>
        </div>
      </section>

      <!-- section photo modification-->

      <section class="modalTemplate" id="editSection" style="display:none">

        <h2 class="modalTitle">Ajout photo</h2>

        <form id="editWorks">

          <div id="addImageContainer">
            <i class="fa-solid fa-image"></i>

            <div id="inputFile">
              <label for="filetoUpload" class="fileLabel">
                <span>+ Ajouter une photo</span>
                <input type="file" id="filetoUpload" name="image" accept="image/png, image/jpeg"
                  class="file-input">
              </label>
            </div>
            <span class="filesize">jpg, png : 4mo max</span>
            <span id="errorImg"></span>
          </div>

          <div class="inputEdit" id="addTitle">
            <label for="title">Titre</label>
            <input type="text" name="title" id="title" class="inputCss" required>
            <span id="ErrorTitleSubmit" class="errormsg"></span>
          </div>

          <div class=" inputEdit" id="addCategory">
            <label for="category">Catégorie</label>
            <select name="category" id="category" data-id="" class="inputCss"></select>
            <span id="ErrorCategorySubmit" class="errormsg"></span>
          </div>

          <div class="footerModal editFooter">
            <hr>
            <input type="submit" value="Valider">
          </div>
        </form>
      </section>

    </div>
  </aside>

    
    `
  );
  
};
const addPicture = () => {
  const inputFile = document.getElementById("filetoUpload");
  const viewImage = document.getElementById("addImageContainer");
  const file = inputFile.files[0];
  // 4Mo en octets => Message D'ERREUR taille max
  const maxSize = 4 * 1024 * 1024;

  if (file.size > maxSize) {
    errorImg.textContent = "Votre image est trop volumineuse";
    console.log("fichier > 4MO!");
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", function () {
    viewImage.innerHTML = "";
    const img = document.createElement("img");
    img.setAttribute("src", reader.result);
    viewImage.appendChild(img);
    viewImage.style.padding = "0";
  });

  reader.readAsDataURL(file);
};

