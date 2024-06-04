const $genre = document.getElementById('genre')
const $selection = document.getElementById('selection')
const $specie = document.getElementById('specie')
let $espece = document.getElementById('espece');

async function getGenus() {
  try {
    const response = await fetch("https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_collection-vegetale-nantes/records?select=genre&where=photo1%20is%20not%20null&group_by=genre").catch(error => {
      throw new Error(error);
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`)
    }
    else {
      const responseData = await response.json();
      console.log(responseData.results.length);
      responseData.results.forEach((element, key) => {
        $genre[key + 1] = new Option(element.genre, element.genre);
      });
    }
  }
  catch (error) {
    console.log("il y a une erreur de chargement", error);
  }
}

async function getSpecies(genus) {
  try {
    const response = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_collection-vegetale-nantes/records?select=count(*)%2C espece&where=genre%3D%22${genus}%22&group_by=espece`).catch(error => {
      throw new Error(error);
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`)
    }
    else {
      while ($specie.firstChild) {
        $specie.removeChild($specie.firstChild);
      }
      let $labelSpecie = document.createElement('label', { for: "espece" });
      $labelSpecie.textContent = "Choisissez l'espèce : "
      $espece = document.createElement('select', { name: "espece", id: "espece" })
      let $elementVide = document.createElement('option', { value: " ", selected: "" })
      $elementVide.textContent = "--"
      $specie.insertAdjacentElement("afterbegin", $labelSpecie)
      $specie.insertAdjacentElement("beforeend", $espece)
      $espece.insertAdjacentElement("afterbegin", $elementVide)
      const responseData = await response.json();
      responseData.results.forEach((element, key) => {
        $espece[key + 1] = new Option(element.espece, element.espece);
      });
      $espece.addEventListener("input", function () {
        let nbre;
        responseData.results.forEach(element => {
          if (element.espece == this.value) {
            nbre=element["count(*)"];
          }
        });
        if (nbre <=100) {
          getInfos(genus, this.value)
        } else {
         // TODO 
        }
      })
    }
  }
  catch (error) {
    console.log("il y a une erreur de chargement", error);
  }
}

async function getInfos(genus, specie) {
  try {
    const response = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_patrimoine-arbore-nantes/records?where=genre%3D%22${genus}%22%20and%20espece%3D%22${specie}%22&limit=100`).catch(error => {
      throw new Error(error);
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`)
    }
    else {
      const responseData = await response.json();
      console.log(responseData);
      // responseData.results.forEach((element, key) => {
      //   $genre[key + 1] = new Option(element.genre, element.genre);
      // });
    }
  }
  catch (error) {
    console.log("il y a une erreur de chargement", error);
    // loader.classList.remove("active");
    // emojiLogo.src = "./ressources/browser.svg";
    // userInformation.textContent = error.message;
  }
}

getGenus()

$genre.addEventListener("input", function () {
  getSpecies(this.value);
})

