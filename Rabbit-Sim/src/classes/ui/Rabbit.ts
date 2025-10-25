export default class Rabbit {
    x: number;
    y: number;
    startX: number;
    startY: number;
    goalX: number;
    goalY: number;
    directionVec: { x: number; y: number };
    color: string;
    speed: number;      // units per frame
    maxSpeed: number;   // optional cap
    reachedGoal: boolean;

    constructor(x: number, y: number, goal : { x: number; y: number }) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.goalX = goal.x;
        this.goalY = goal.y;
        this.directionVec = { x: goal.x - x, y: goal.y - y };
        // tune these to slow/speed up rabbits
        this.speed = 0.25;    // smaller = slower
        this.maxSpeed = 1.0;
        this.reachedGoal = false;

        const randByte = () => 230 + Math.floor(Math.random() * 26);
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        const r = randByte(), g = randByte(), b = randByte();
        this.color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    getDirection() {
        return this.directionVec;
    }
    
    setGoal(goal: { x: number; y: number }) {
        this.directionVec = { x: goal.x - this.x, y: goal.y - this.y };
    }

    seperateFromAlignmentCohesion(other: Rabbit[], minDistance: number) {

        // if near goal the chenge direction to head back to start
        const goalDistX = this.goalX - this.x;
        const goalDistY = this.goalY - this.y;
        const goalDistSq = goalDistX * goalDistX + goalDistY * goalDistY;
        // console.log("Goal distance squared: " + goalDistSq);
        if (goalDistSq < 25) { // within 5 units of goal
            this.setGoal({ x: this.startX, y: this.startY });
            // console.log("Changing goal to start");
            this.reachedGoal = true;
        }

        if (this.reachedGoal) {
            const startDistX = this.startX - this.x;
            const startDistY = this.startY - this.y;
            const startDistSq = startDistX * startDistX + startDistY * startDistY;
            if (startDistSq < 25) { // within 5 units of start
                this.setGoal({ x: this.goalX, y: this.goalY });
            }
        }

        // change direction slightly towards the goal
        const dirToGoalX = this.goalX - this.x;
        const dirToGoalY = this.goalY - this.y;
        const dirToGoalMag = Math.hypot(dirToGoalX, dirToGoalY);
        if (dirToGoalMag > 0) {
            const normDirToGoalX = dirToGoalX / dirToGoalMag;
            const normDirToGoalY = dirToGoalY / dirToGoalMag;
            this.directionVec.x += normDirToGoalX * 0.05;
            this.directionVec.y += normDirToGoalY * 0.05;
        }

        let moveX = 0;
        let moveY = 0;

        // seperation

        const closestRabbits: Rabbit[] = [];
        for (const o of other) {
            if (o === this) continue;
            const dist = Math.hypot(this.x - o.x, this.y - o.y);
            // keep rabbits approximately 1 or 2 units away (rounded)
            const r = Math.round(dist);
            if (r < 2) closestRabbits.push(o);
        }

        for (const o of closestRabbits) {
            if (o === this) continue;
            const distX = this.x - o.x;
            const distY = this.y - o.y;
            const distSq = distX * distX + distY * distY;
            if (distSq < minDistance * minDistance) {
                const angle = Math.atan2(distY, distX);
                moveX += Math.cos(angle);
                moveY += Math.sin(angle);
            }
        }

        // alignment
        let avgDirX = 0;
        let avgDirY = 0;
        let count = 0;

        const sortOfNearRabbits: Rabbit[] = [];
        for (const o of other) {
            if (o === this) continue;
            const dist = Math.hypot(this.x - o.x, this.y - o.y);
            if (dist < 5) {
                sortOfNearRabbits.push(o);
            }
        }

        for (const o of sortOfNearRabbits) {
            if (o === this) continue;
            const distX = this.x - o.x;
            const distY = this.y - o.y;
            const distSq = distX * distX + distY * distY;
            if (distSq < 50 * 50) {
                const dir = o.getDirection();
                avgDirX += dir.x;
                avgDirY += dir.y;
                count++;
            }
        }

        if (count > 0) {   
            avgDirX /= count;
            avgDirY /= count;
            const angle = Math.atan2(avgDirY, avgDirX);
            moveX += Math.cos(angle) * 0.5;
            moveY += Math.sin(angle) * 0.5;
        }

        // Cohesion
        let centerX = 0;
        let centerY = 0;
        count = 0;

        for (const o of sortOfNearRabbits) {
            if (o === this) continue;
            centerX += o.x;
            centerY += o.y;
            count++;
        }

        if (count > 0) {
            centerX /= count;
            centerY /= count;
            const angle = Math.atan2(centerY - this.y, centerX - this.x);
            moveX += Math.cos(angle) * 0.5;
            moveY += Math.sin(angle) * 0.5;
        }

        // after computing moveX/moveY from separation/alignment/cohesion
        // normalize and scale by speed, and optionally cap by maxSpeed
        const mag = Math.hypot(moveX, moveY);
        if (mag > 0) {
            // scale to desired per-frame speed (keeps direction)
            const scale = this.speed / mag;
            let dx = moveX * scale;
            let dy = moveY * scale;
            // optional cap (if you want a hard max)
            const capped = Math.hypot(dx, dy);
            if (capped > this.maxSpeed) {
                dx = (dx / capped) * this.maxSpeed;
                dy = (dy / capped) * this.maxSpeed;
            }
            this.move(dx, dy);
        }
    }
}