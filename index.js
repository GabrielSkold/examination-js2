const nameInput = document.querySelector("#pet-name");
const typeSelect = document.querySelector("#pet-type");
const petsContainer = document.querySelector("#pets-container");
const historyLog = document.querySelector("#history");
const checkboxInput = document.querySelector("#random-name");
const petImages = {
    Mametchi: "images/pet-1.png",
    Togetchi: "images/pet-2.png",
    Tarakotchi: "images/pet-3.png",
    Kuchipatchi: "images/pet-4.png"
};
// klass för Tamagotchi
class Pet {
    constructor(name, animalType){
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.happiness = 50;
        this.fullness = 50;

        this.petStats();
        this.isRunaway();
    }

    petStats() {
        this.energy = Math.max(0, Math.min(100, this.energy));
        this.fullness = Math.max(0, Math.min(100, this.fullness));
        this.happiness = Math.max(0, Math.min(100, this.happiness));
    }

    isRunaway() {
        return this.energy === 0 || this.fullness === 0 || this.happiness === 0;
    }
    nap() {
        this.energy += 40;
        this.happiness -=10;
        this.fullness -= 10;
        this.petStats();
        return `${this.name} took a nap!`;
    }
    play() {
        this.happiness += 30;
        this.energy -=10;
        this.fullness -= 10;
        this.petStats();
        return `You played with ${this.name}`;
    }
    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.petStats();
        return `${this.name} ate!`;
    }
}

function statUpdate(pet, petCard) {
    petCard.querySelector(".energy").value = pet.energy;
    petCard.querySelector(".energy-text").textContent = `${pet.energy}`;
    petCard.querySelector(".fullness").value = pet.fullness;
    petCard.querySelector(".fullness-text").textContent = `${pet.fullness}`;
    petCard.querySelector(".happiness").value = pet.happiness;
    petCard.querySelector(".happiness-text").textContent = `${pet.happiness}`;
}

function renderPet(pet) {
    const petCard = document.createElement("div");
    petCard.classList.add("pet-card");

    const imgSrc = petImages[pet.animalType] ?? "images/default.png";

    petCard.innerHTML = `
        <h3>${pet.name} (${pet.animalType})</h3>
        <img class="pet-img" src="${imgSrc}" alt="${pet.animalType}">

        <label>Energy</label>
        <div class="bar-wrap">
            <progress class="energy" value="${pet.energy}" max="100"></progress>
            <span class="bar-text energy-text">${pet.energy}</span>
        </div>

        <label>Fullness</label>
        <div class="bar-wrap">
            <progress class="fullness" value="${pet.fullness}" max="100"></progress>
            <span class="bar-text fullness-text">${pet.fullness}</span>
        </div>

        <label>Happiness</label>
        <div class="bar-wrap">
            <progress class="happiness" value="${pet.happiness}" max="100"></progress>
            <span class="bar-text happiness-text">${pet.happiness}</span>
        </div>

        <button class="nap-btn">Nap</button>
        <button class="eat-btn">Eat</button>
        <button class="play-btn">Play</button>
        `;

    const napBtn = petCard.querySelector(".nap-btn");
    const playBtn = petCard.querySelector(".play-btn");
    const eatBtn = petCard.querySelector(".eat-btn");

    napBtn.addEventListener("click", () => {
        const msg = pet.nap();
        statUpdate(pet, petCard);
        addLog(msg);

        if (pet.isRunaway()) {
            addLog(`${pet.name} ran away due to neglect!`);
            petCard.remove();
        }
    });

    playBtn.addEventListener("click", () => {
        const msg = pet.play();
        statUpdate(pet, petCard);
        addLog(msg);

        if (pet.isRunaway()) {
            addLog(`${pet.name} ran away due to neglect!`);
            petCard.remove();
        }
    });

    eatBtn.addEventListener("click", () => {
        const msg = pet.eat();
        statUpdate(pet, petCard);
        addLog(msg);

        if (pet.isRunaway()) {
            addLog(`${pet.name} ran away due to neglect!`);
            petCard.remove();
        }
    });

    // Timer för stats
    pet.intervalId = setInterval(() => {
        pet.energy -= 10;
        pet.fullness -= 10;
        pet.happiness -= 10;
        pet.petStats();

        statUpdate(pet, petCard);

        if (pet.isRunaway()) {
            addLog(`${pet.name} ran away due to neglect!`);
            clearInterval(pet.intervalId);
            petCard.remove();
        }
    }, 10000);

    return petCard;
}

const createBtn = document.querySelector("#create-pet");
createBtn.addEventListener("click", async (e) => {
    e.preventDefault?.();
    const maxPets = 4;
    if(petsContainer.children.length >= maxPets) {
        alert("Du kan max ha fyra djur samtidigt!")
        return;
    }

    const petType = typeSelect.value;

    let name = nameInput.value;

  // Om checkbox är ikryssad ELLER input är tom -> hämta från API
  if (checkboxInput.checked) {
    const fetched = await nameFetch();
    if (fetched) name = fetched;
  }

    const pet = new Pet(name, petType);
    const petCard = renderPet(pet);

    petsContainer.append(petCard);
})

// API anrop
async function nameFetch() {
    try {
        const res = await fetch("https://randomuser.me/api/");

        console.log("Status:", res.status, res.statusText);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("API data:", data);

        const first = data.results[0].name.first;

        if (!first) throw new Error("Could not find results[0].name.first in response");

        return first;
    } catch (err) {
        console.log("fetchRandomName failed:", err);
        return null;
    }
}

// Activity history function
function addLog(message) {
    const para = document.createElement("p");
    para.textContent = message;
    historyLog.append(para);
}