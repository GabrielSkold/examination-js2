const url = ("https://randomuser.me/api");
const nameInput = document.querySelector("#tama-name");
const typeSelect = document.querySelector("#pet-type");
const petsContainer = document.querySelector("#pets-container");
const historyLog = document.querySelector("#history");

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
createBtn.addEventListener("click", () => {
    const maxPets = 4;

    if(petsContainer.children.length >= maxPets) {
        alert("Du kan max ha fyra djur samtidigt!")
        return;
    }

    const name = nameInput.value;
    const petType = typeSelect.value;

    const pet = new Pet(name, petType);
    const petCard = renderPet(pet);

    petsContainer.append(petCard);
})

async function fetchName() {
    try {
        const response = await fetch("https://randomuser.me/api")
        console.log(url);

        if(!response.ok){
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        const randomName = data?.results?.[0]?.name?.first;

        if(!randomName) {
            throw new Error("Kunde inte läsa namn från API-svaret.")
        }
        return randomName;
    } catch (error) {
        //Loggar för mig själv
        console.error("fetchName failed:", error);

        //Returnerar null
        return null;
    }
}

//Logg för aktivitetshistorik
function addLog(message) {
    const para = document.createElement("p");
    para.textContent = message;
    historyLog.append(para);
}