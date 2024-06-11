const $genre = document.getElementById('genre')
const $selection = document.getElementById('selection')
const $specie = document.getElementById('specie')
let $espece = document.getElementById('espece');
const $resultat = document.getElementById('resultat')

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
    const response = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_collection-vegetale-nantes/records?select=count(*)%2C%20espece&where=genre%3D%22${genus}%22%20and%20photo1%20is%20not%20null&group_by=espece`).catch(error => {
      throw new Error(error);
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`)
    }
    else {
      while ($resultat.firstChild) {
        $resultat.removeChild($resultat.firstChild);
      }
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
      //TODO trouver un moyen de mettre les null (epèce inconnue à la fin)
      responseData.results.forEach((element, key) => {
        if (element.espece != null) {
          $espece[key + 1] = new Option(element.espece, element.espece);
        } else {
          $espece[key + 1] = new Option("espèce inconnue", element.espece);
        }
      });
      $espece.addEventListener("input", function () {
        let nbre;
        responseData.results.forEach(element => {
          if (element.espece == this.value) {
            nbre = element["count(*)"];
          }
        });
          getInfos(genus, this.value, nbre)
      })
    }
  }
  catch (error) {
    console.log("il y a une erreur de chargement", error);
  }
}

async function getInfos(genus, specie, nbre) {
  let offset = 0;
  while (nbre > 0) {
    try {
      const response = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_collection-vegetale-nantes/records?where=genre%3D%22${genus}%22%20and%20espece%3D%22${specie}%22%20and%20photo1%20is%20not%20null&limit=100&offset=${offset}`).catch(error => {
        throw new Error(error);
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}, ${response.statusText}`)
      }
      else {
        if (offset == 0) {
          while ($resultat.firstChild) {
            $resultat.removeChild($resultat.firstChild);
          }
        }
        offset += 100;
        nbre -= 100;
        const responseData = await response.json();
        console.log(offset, responseData);
        responseData.results.forEach((element, key) => {
          const image = `<img class = "img-fluid" src=${element.photo1.url} alt="${genus} ${specie}">`;
          const $individu = document.createElement('span');
          $individu.setAttribute("class","col-6 col-sm-3 col-md-1");
          $individu.setAttribute("id", key);
          $individu.innerHTML = image;
          $resultat.insertAdjacentElement("beforeend", $individu)
        });
      }
    }
    catch (error) {
      console.log("il y a une erreur de chargement", error);
    }
  }
}

getGenus()

$genre.addEventListener("input", function () {
  getSpecies(this.value);
})

