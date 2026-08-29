// ============================================
// PLAYER.JS
// ============================================

import {
    isWall
} from "./world.js";


export class Player {

    constructor(
        x,
        y,
        angle
    ) {

        this.x = x;

        this.y = y;

        this.angle = angle;

        // Movement speed in world units/second.
        this.moveSpeed = 4;

        // Rotation speed.
        this.rotationSpeed = 2.5;

        // Collision radius.
        this.radius = 0.20;
    }


    update(
        input,
        deltaTime
    ) {

        let forward = 0;

        let strafe = 0;


        // ====================================
        // FORWARD / BACKWARD
        // ====================================

        if (
            input.isDown("KeyW") ||
            input.isDown("ArrowUp")
        ) {

            forward += 1;
        }


        if (
            input.isDown("KeyS") ||
            input.isDown("ArrowDown")
        ) {

            forward -= 1;
        }


        // ====================================
        // STRAFE
        // ====================================

        if (
            input.isDown("KeyA")
        ) {

            strafe -= 1;
        }


        if (
            input.isDown("KeyD")
        ) {

            strafe += 1;
        }


        // ====================================
        // MOVE
        // ====================================

        this.move(
            forward,
            strafe,
            deltaTime
        );


        // ====================================
        // KEYBOARD ROTATION
        // ====================================

        if (
            input.isDown("ArrowLeft")
        ) {

            this.rotate(
                -1,
                deltaTime
            );
        }


        if (
            input.isDown("ArrowRight")
        ) {

            this.rotate(
                1,
                deltaTime
            );
        }


        // ====================================
        // MOUSE ROTATION
        // ====================================

        const mouseDelta =
            input.consumeMouseDelta();


        this.angle +=
            mouseDelta;


        this.normalizeAngle();
    }


    // ========================================
    // MOVEMENT
    // ========================================

    move(
        forward,
        strafe,
        deltaTime
    ) {

        if (
            forward === 0 &&
            strafe === 0
        ) {

            return;
        }


        // Normalize diagonal movement.

        const magnitude =
            Math.sqrt(
                forward * forward +
                strafe * strafe
            );


        if (
            magnitude > 1
        ) {

            forward /= magnitude;

            strafe /= magnitude;
        }


        const distance =
            this.moveSpeed *
            deltaTime;


        // Direction vectors.

        const forwardX =
            Math.cos(this.angle);

        const forwardY =
            Math.sin(this.angle);


        const rightX =
            -Math.sin(this.angle);

        const rightY =
            Math.cos(this.angle);


        // Calculate movement.

        const dx =
            (
                forwardX * forward +
                rightX * strafe
            ) *
            distance;


        const dy =
            (
                forwardY * forward +
                rightY * strafe
            ) *
            distance;


        this.tryMove(
            dx,
            dy
        );
    }


    // ========================================
    // COLLISION-AWARE MOVEMENT
    // ========================================

    tryMove(
        dx,
        dy
    ) {

        const newX =
            this.x + dx;


        const newY =
            this.y + dy;


        // X axis

        if (
            !this.collides(
                newX,
                this.y
            )
        ) {

            this.x = newX;
        }


        // Y axis

        if (
            !this.collides(
                this.x,
                newY
            )
        ) {

            this.y = newY;
        }
    }


    // ========================================
    // COLLISION
    // ========================================

    collides(
        x,
        y
    ) {

        const r =
            this.radius;


        return (
            isWall(
                x + r,
                y
            ) ||

            isWall(
                x - r,
                y
            ) ||

            isWall(
                x,
                y + r
            ) ||

            isWall(
                x,
                y - r
            )
        );
    }


    // ========================================
    // ROTATION
    // ========================================

    rotate(
        direction,
        deltaTime
    ) {

        this.angle +=
            direction *
            this.rotationSpeed *
            deltaTime;


        this.normalizeAngle();
    }


    // ========================================
    // NORMALIZE ANGLE
    // ========================================

    normalizeAngle() {

        const twoPi =
            Math.PI * 2;


        this.angle =
            this.angle % twoPi;


        if (
            this.angle < 0
        ) {

            this.angle += twoPi;
        }
    }
}