let planetData = [];
let selectedPlanet;

/*------------------------- FUNCTION : getPlanetInfo ------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  getClickableList();  
  getPlanetInfo();
  generateStarField(); // Chiamiamo la funzione per generare le stelle iniziali

  function getApiKey() {
    return fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", {
      method: "POST",
      headers: { "x-zocom": "" },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error during Api request. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Key gotten:", data.key);
        return data.key;
      })
      .catch(error => {
        console.error("Error during Api request:", error);
        throw error;
      });
  }

  async function getPlanetInfo() {
    try {
      const apiKey = await getApiKey();
      console.log("Api-key used:", apiKey);
      const apiUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "x-zocom": apiKey },
      });

      if (!response.ok) {
        throw new Error(`Error during Api request. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.bodies && Array.isArray(data.bodies)) {
        planetData = data.bodies;
        console.log("Received data:", planetData);
        attachClickEvents();
        attachHoverEvents();
      } else {
        console.error("Invalid data format from API");
      }
    } catch (error) {
      console.error("Main error:", error);
    }
  }

  function getClickableList() {
    const clickableElements = document.querySelectorAll('.toClick');
    return Array.from(clickableElements);
  }

  function attachClickEvents() {
    const clickableList = getClickableList();
    clickableList.forEach((element, index) => {
      element.addEventListener('click', () => {
        console.log("Index:", index);
        console.log("Planet Data Length:", planetData.length);

        if (planetData && planetData.length > index) {
          selectedPlanet = planetData[index];
          console.log("Selected Planet:", selectedPlanet);

          const overlayContent = `  <div class="overlay" id="pageOverlay">
            <button id="goBackBtn">&leftarrow;</button>
            <div class=" planetsImg  ${selectedPlanet.name.toLowerCase()}"></div>
            ${selectedPlanet.name.toLowerCase() === 'saturnus' ? '<div class="ring2"></div>' : ''}
            <div class="planetInfo">
              <div class="titlesBoxOverlay">
                <h1>${selectedPlanet.name}</h1>
                <h2>${selectedPlanet.latinName}</h2>
              </div>
              <p>${selectedPlanet.desc}</p>
              <hr>
              <div class="detailsBox" >
                <div class="detailType1">
                  <div class="details">
                    <h3>OMKRETS</h2>
                    <P>${selectedPlanet.circumference}</P>
                  </div>
                  <div class="details ">
                    <h3>MAX TEMPERATUR</h2>
                    <P>${selectedPlanet.temp.day}</P>
                  </div>
                </div>
                <div class="detailType2">
                  <div class="details">
                    <h3>KM FRÅN SOLEN</h2>
                    <P>${selectedPlanet.distance}</P>
                  </div>
                  <div class="details">
                    <h3>MIN TEMPERATUR</h2>
                    <P>${selectedPlanet.temp.night}</P>
                  </div>
                </div>
              </div>
              <hr>
              <div class="moons details">
                <h3>MÅNAR</h2>
                <P>${selectedPlanet.moons.length > 0 ? selectedPlanet.moons.join(', ') : 'Noll'}</P>
              </div>
            </div>
          </div>`;

          document.body.innerHTML = '';
          document.body.innerHTML = overlayContent;

          const goBackBtn = document.getElementById("goBackBtn");

          if (goBackBtn) {
            goBackBtn.addEventListener('click', () => {
              location.reload();
            });
          }

          generateStarField(); // Chiamiamo la funzione per generare le stelle dopo l'overlay
        } else {
          console.error("Planet data undefined or index out of bounds");
        }
      });
    });
  }

  function attachHoverEvents() {
    const clickableList = getClickableList();
    let previewCreated = false;

    clickableList.forEach((element, index) => {
      element.addEventListener('mouseover', () => {
        console.log('Mouse over planet');
        if (planetData && planetData.length > index && !previewCreated) {
          selectedPlanet = planetData[index];
          const planetName = document.createElement("h3");
          planetName.innerText = selectedPlanet.name;
          planetName.classList.add("preview");

          const previewContainer = document.createElement("div");
          previewContainer.classList.add("preview-container");
          previewContainer.appendChild(planetName);

          // Inserisci l'anteprima subito prima dell'elemento di riferimento (il pianeta)
          element.insertAdjacentElement('beforebegin', previewContainer);

          previewCreated = true; // Imposta il flag per indicare che l'anteprima è stata creata
        }
      });

      element.addEventListener('mouseout', () => {
        // Rimuovi l'anteprima solo se è stata creata
        if (previewCreated) {
          const previewContainer = element.previousSibling;
          if (previewContainer) {
            previewContainer.remove();
          }
          previewCreated = false; // Resetta il flag quando l'anteprima viene rimossa
        }
      });
    });
  }

  function generateStarField() {
    const starContainer = document.createElement('div');
    starContainer.id = 'star-container';

    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = getRandomNumber(1, 4);
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${getRandomNumber(0, 100)}vh`;
      star.style.left = `${getRandomNumber(0, 100)}vw`;
      starContainer.appendChild(star);
    }

    document.body.appendChild(starContainer);
  }

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
});
