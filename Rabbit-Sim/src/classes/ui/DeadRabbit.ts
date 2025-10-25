export default class DeadRabbit {
    x: number;
    y: number
    color: string;
    lifetime: number; // frames remaining

    constructor(x: number, y: number, lifetime: number) {
        this.x = x;
        this.y = y;
        this.color = '#cb3535ff';
        this.lifetime = lifetime;
    }

    decreaseLifetime() {
        this.lifetime--;
        // lower colour alpha as lifetime decreases
        const alpha = Math.max(0, this.lifetime / 100);
        this.color = `#cb3535${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
    }

    isExpired() {
        return this.lifetime <= 0;
    }
}