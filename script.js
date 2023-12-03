let planetData = [];


/*------------------------- FUNCTION : getPlanetInfo ------------------------*/
document.addEventListener('DOMContentLoaded', () => {

  getClickableList();  
  getPlanetInfo();

async function getApiKey() {
  try {
    console.log("Start request");
    const response = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", {
      method: "POST",
      headers: { "x-zocom": "" },
    });

    if (!response.ok) {
      throw new Error(`Error during Api request. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Key gotten:", data.key);
    return data.key;
  } catch (error) {
    console.error("Error during Api request:", error);
    throw error;
  }
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
    
    // Assicurati che l'array di pianeti sia presente in data
    if (data.bodies && Array.isArray(data.bodies)) {
      planetData = data.bodies;
      console.log("Received data:", planetData);
      attachClickEvents();
    } else {
      console.error("Invalid data format from API");
    }
  } catch (error) {
    console.error("Main error:", error);
  }
}


// ottiengo una lista di elementi cliccabili dal mio html 

function getClickableList () {
  const clickableElements = document.querySelectorAll('.toClick');
  const clickableArray = Array.from(clickableElements);
  console.log("Clickable List:", clickableArray); 
  return clickableArray;
}
const clickableList = getClickableList();
console.log(clickableList);



function attachClickEvents() {
  clickableList.forEach((element, index) => {
    element.addEventListener('click', () => {
      console.log("Index:", index);
      console.log("Planet Data Length:", planetData.length);

      //Mio codice qui????
     
      if (planetData && planetData.length > index) {
        const selectedPlanet = planetData[index];
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

        <p>${selectedPlanet.desc}
        </p>

        <hr>
        
        <div class="detailsBox" >
           
        
            <div class="detailType1">
            
            <div class="details">
                <h3>OMKRETS</h2>
                <P>${selectedPlanet.circumference
                }</P>
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
        
    </div>`

    document.body.innerHTML = '';
    document.body.innerHTML = overlayContent;

    const goBackBtn = document.getElementById("goBackBtn"); 

    if (goBackBtn) {
      goBackBtn.addEventListener('click', () => {
        location.reload();
      } )
    }
 
// Riaggiungi le stelle dopo aver aggiornato l'overlay
const starContainer = document.createElement('div');
starContainer.id = 'star-container';


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

    
      } else {
        console.error("Planet data undefined or index out of bounds");
      }
    });
  });
}
getRandomNumber();



/*------------------------- OTHER CODE (e.g., stars) -----------------------*/
const numberOfStars = 100;

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < numberOfStars; i++) {
  const star = document.createElement("div");
  star.className = "star";
  const size = getRandomNumber(1, 4);
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${getRandomNumber(0, 100)}vh`;
  star.style.left = `${getRandomNumber(0, 100)}vw`;
  document.body.appendChild(star);
}
});