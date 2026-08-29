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

        this.moveSpeed = 4;

        this.rotationSpeed = 2.5;

        this.radius = 0.2;
    }


    update(
        input,
        deltaTime
    ) {

        let forward = 0;

        let strafe = 0;


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


        this.move(
            forward,
            strafe,
            deltaTime
        );


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


        this.angle +=
            input.consumeMouseDelta();


        this.normalizeAngle();
    }


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


        const speed =
            this.moveSpeed *
            deltaTime;


        const forwardX =
            Math.cos(this.angle);

        const forwardY =
            Math.sin(this.angle);


        const rightX =
            -Math.sin(this.angle);

        const rightY =
            Math.cos(this.angle);


        const dx =
            (
                forwardX * forward +
                rightX * strafe
            ) * speed;


        const dy =
            (
                forwardY * forward +
                rightY * strafe
            ) * speed;


        this.tryMove(
            dx,
            dy
        );
    }


    tryMove(
        dx,
        dy
    ) {

        const newX =
            this.x + dx;


        const newY =
            this.y + dy;


        if (
            !this.collides(
                newX,
                this.y
            )
        ) {

            this.x = newX;
        }


        if (
            !this.collides(
                this.x,
                newY
            )
        ) {

            this.y = newY;
        }
    }


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


    normalizeAngle() {

        const twoPi =
            Math.PI * 2;


        this.angle =
            this.angle %
            twoPi;


        if (
            this.angle < 0
        ) {

            this.angle +=
                twoPi;
        }
    }
}