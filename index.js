const nameInput = document.querySelector("#tama-name");
const typeSelect = document.querySelector("#pet-type");
const petsContainer = document.querySelector("#pets-container");
const historyLog = document.querySelector("#history");
const checkboxInput = document.querySelector("#random-name");

// Skapar klass för Tamagotchi objekt
class Pet {
    constructor(name, animalType){
        this.name = name;
        this.animalType = animalType;

        this.energy = 50;
        this.happiness = 50;
        this.fullness = 50;

        this.clampStats();
    }

    clampStats() {
        this.energy = Math.max(0, Math.min(100, this.energy));
        this.fullness = Math.max(0, Math.min(100, this.fullness));
        this.happiness = Math.max(0, Math.min(100, this.happiness));
    }
    nap() {
        this.energy += 40;
        this.happiness -=10;
        this.fullness -= 10;
        this.clampStats();
        return `${this.name} took a nap!`;
    }
    play() {
        this.happiness += 30;
        this.energy -=10;
        this.fullness -= 10;
        this.clampStats();
        return `You played with ${this.name}`;
    }
    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.clampStats();
        return `${this.name} had a good meal!`;
    }
}

function updatePetStats(pet, petCard) {
    petCard.querySelector(".energy").textContent = pet.energy;
    petCard.querySelector(".fullness").textContent = pet.fullness;
    petCard.querySelector(".happiness").textContent = pet.happiness;
}

function renderPet(pet) {
    const petCard = document.createElement("div");
    petCard.classList.add("pet-card");

    petCard.innerHTML = `
        <h3>${pet.name} (${pet.animalType})</h3>
        <p>Energy: <span class="energy">${pet.energy}</span></p>
        <p>Fullness: <span class="fullness">${pet.fullness}</span></p>
        <p>Happiness: <span class="happiness">${pet.happiness}</span></p>
        <button class="nap-btn">Nap</button>
        <button class="play-btn">Play</button>
        <button class="eat-btn">Eat</button>
    `;

    const napBtn = petCard.querySelector(".nap-btn");
    const playBtn = petCard.querySelector(".play-btn");
    const eatBtn = petCard.querySelector(".eat-btn");

    napBtn.addEventListener("click", () => {
        const msg = pet.nap();
        updatePetStats(pet, petCard);
        addLog(msg);
    });

    playBtn.addEventListener("click", () => {
        const msg = pet.play();
        updatePetStats(pet, petCard);
        addLog(msg);
    });

    eatBtn.addEventListener("click", () => {
        const msg = pet.eat();
        updatePetStats(pet, petCard);
        addLog(msg);
    });

    return petCard;
}

const createBtn = document.querySelector("#create-pet");
createBtn.addEventListener("click", async () => {
    const maxPets = 4;

    if(petsContainer.children.length >= maxPets) {
        alert("Du kan max ha fyra djur samtidigt!")
        return;
    }

    const petType = typeSelect.value;

    let name = nameInput.value.trim();

  // Om checkbox är ikryssad ELLER input är tom -> hämta från API
  if (checkboxInput.checked || !name) {
    const fetched = await nameFetch();
    if (fetched) name = fetched;
  }

    const pet = new Pet(name, petType);
    const petCard = renderPet(pet);

    petsContainer.append(petCard);
})

async function nameFetch() {
  try {
    const res = await fetch("https://randomuser.me/api/0.8");

    console.log("Status:", res.status, res.statusText);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    console.log("API data:", data);

    const first = data.results[0].user.name.first;

    if (!first) throw new Error("Could not find results[0].name.first in response");

    return first;
  } catch (err) {
    console.error("fetchRandomName failed:", err);
    return null;
  }
}
(async () => console.log("Random name:", await nameFetch()))();

//Logg för aktivitetshistorik
function addLog(message) {
    const para = document.createElement("p");
    para.textContent = message;
    historyLog.append(para);
}
