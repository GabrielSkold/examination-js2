// Skapar klass för Tamagotchi objekt
class Tamagothchi {
    constructor(name, tamaType, age){
        this.name = name;
        this.tamaType = tamaType;
        this.age = age;

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
    takeNap() {
        this.energy += 40;
        this.happiness -=10;
        this.fullness -= 10;
        this.clampStats();
        return `You put ${this.name} down for a nap!`;
    }
    goPlay() {
        this.happiness += 30;
        this.energy -=10;
        this.fullness -= 10;
        this.clampStats();
        return `You played with ${this.name}`;
    }
    eatFood() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.clampStats();
        return`${this.name} had a good meal!`;
    }
}
const Tamagotchi = new Tamagothchi("maya", "dragon");
console.log(Tamagotchi);
console.log(Tamagotchi.takeNap());


