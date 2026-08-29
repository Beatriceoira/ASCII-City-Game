// ============================================
// PLAYER.JS
// ============================================

import { isWall } from "./world.js";

export class Player {

    constructor(x, y, angle = 0) {

        this.x = x;
        this.y = y;

        this.angle = angle;

        this.moveSpeed = 4.0;
        this.rotationSpeed = 2.5;

        this.radius = 0.2;
    }


    // ========================================
    // MOVE
    // ========================================

    move(forward, strafe, deltaTime) {

        const speed =
            this.moveSpeed *
            deltaTime;

        const cos =
            Math.cos(this.angle);

        const sin =
            Math.sin(this.angle);


        const dx =
            (cos * forward -
            sin * strafe) *
            speed;

        const dy =
            (sin * forward +
            cos * strafe) *
            speed;


        this.tryMove(
            dx,
            dy
        );
    }


    // ========================================
    // COLLISION
    // ========================================

    tryMove(dx, dy) {

        const newX =
            this.x + dx;

        const newY =
            this.y + dy;


        // X collision

        if (
            !isWall(
                newX + this.radius,
                this.y
            ) &&
            !isWall(
                newX - this.radius,
                this.y
            )
        ) {

            this.x = newX;
        }


        // Y collision

        if (
            !isWall(
                this.x,
                newY + this.radius
            ) &&
            !isWall(
                this.x,
                newY - this.radius
            )
        ) {

            this.y = newY;
        }
    }


    // ========================================
    // ROTATE
    // ========================================

    rotate(amount, deltaTime) {

        this.angle +=
            amount *
            this.rotationSpeed *
            deltaTime;


        // Keep angle within 0 → 2π

        this.angle %= Math.PI * 2;

        if (this.angle < 0) {

            this.angle +=
                Math.PI * 2;
        }
    }
}