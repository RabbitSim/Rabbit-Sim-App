export default class FoodStorage {
    x: number;
    y: number;
    height: number;
    color: string;
    amount: number; // units of food stored
    capacity: number; // max units of food that can be stored

    constructor(x: number, y: number, height = 0) {
        this.x = x;
        this.y = y;
        this.height = height / 100
        this.color = '#ff5100ff'; // orange color
        this.amount = 0;
        this.capacity = Infinity;
    }

    storeFood(units: number) {
        this.amount = Math.min(this.amount + units, this.capacity);
        this.height = Math.floor(this.amount / 100); // Update height based on fill level
        console.log(`FoodStorage at (${this.x}, ${this.y}) now has ${this.amount} units of food.`);
    }

    retrieveFood(units: number): number {
        const retrieved = Math.min(units, this.amount);
        this.amount -= retrieved;
        this.height = Math.floor(this.amount / 100); // Update height based on fill level
        return retrieved;
    }

    isFull(): boolean {
        return this.amount >= this.capacity;
    }

    isEmpty(): boolean {
        return this.amount <= 0;
    }

    getFillLevel(): number {
        return this.amount / this.capacity;
    } 
}