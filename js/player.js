
// ========================================
// ASCII CITY — PLAYER.JS
// VERSION 4
// ========================================

export class Player {

    // ========================================
    // CONSTRUCTOR
    // ========================================

    constructor(
        x = 12.5,
        y = 12.5,
        angle = 0
    ) {

        // ----------------------------------------
        // POSITION
        // ----------------------------------------

        this.x = x;
        this.y = y;

        // Direction in radians
        this.angle = angle;


        // ----------------------------------------
        // MOVEMENT
        // ----------------------------------------

        this.moveSpeed = 4.0;

        this.rotationSpeed = 2.5;

        this.strafeSpeed = 3.0;


        // ----------------------------------------
        // SPRINT
        // ----------------------------------------

        this.sprintMultiplier = 1.8;


        // ----------------------------------------
        // COLLISION
        // ----------------------------------------

        this.radius = 0.20;


        // ----------------------------------------
        // CAMERA
        // ----------------------------------------

        this.height = 0.5;

        this.pitch = 0;


        // ----------------------------------------
        // WORLD
        // ----------------------------------------

        // Version 4 obtains the city through
        // world.js rather than passing a World
        // object into the constructor.
        this.world = null;
    }


    // ========================================
    // UPDATE
    // ========================================

    update(
        deltaTime,
        input
    ) {

        // ----------------------------------------
        // SAFETY
        // ----------------------------------------

        if (
            !input ||
            typeof input.isDown !== "function"
        ) {
            return;
        }


        // Prevent unusually large movement
        // after the browser loses focus.
        deltaTime =
            Math.min(
                deltaTime,
                0.1
            );

    // ========================================
        // MOUSE LOOK
        // ========================================

        if (
            typeof input.getMouseDeltaX === "function"
        ) {

            const mouseX =
                input.getMouseDeltaX();

            this.angle +=
                mouseX *
                0.0025;
        }


        // ----------------------------------------
        // ROTATION
        // ----------------------------------------

        let rotation = 0;


        // A / LEFT
        if (
            input.isDown("KeyA") ||
            input.isDown("ArrowLeft")
        ) {

            rotation -=
                this.rotationSpeed *
                deltaTime;
        }


        // D / RIGHT
        if (
            input.isDown("KeyD") ||
            input.isDown("ArrowRight")
        ) {

            rotation +=
                this.rotationSpeed *
                deltaTime;
        }


        this.angle += rotation;


        // ----------------------------------------
        // NORMALIZE ANGLE
        // ----------------------------------------

        this.angle =
            this.angle %
            (Math.PI * 2);


        if (
            this.angle < 0
        ) {

            this.angle +=
                Math.PI * 2;
        }


        // ----------------------------------------
        // MOVEMENT INPUT
        // ----------------------------------------

        let forward = 0;

        let strafe = 0;


        // W / UP
        if (
            input.isDown("KeyW") ||
            input.isDown("ArrowUp")
        ) {

            forward += 1;
        }


        // S / DOWN
        if (
            input.isDown("KeyS") ||
            input.isDown("ArrowDown")
        ) {

            forward -= 1;
        }


        // Q = STRAFE LEFT
        if (
            input.isDown("KeyQ")
        ) {

            strafe -= 1;
        }


        // E = STRAFE RIGHT
        if (
            input.isDown("KeyE")
        ) {

            strafe += 1;
        }


        // ----------------------------------------
        // NO MOVEMENT
        // ----------------------------------------

        if (
            forward === 0 &&
            strafe === 0
        ) {

            return;
        }


        // ----------------------------------------
        // SPEED
        // ----------------------------------------

        let speed =
            this.moveSpeed;


        // Sprint
        if (
            input.isDown("ShiftLeft") ||
            input.isDown("ShiftRight")
        ) {

            speed *=
                this.sprintMultiplier;
        }


        // ----------------------------------------
        // DIRECTION VECTORS
        // ----------------------------------------

        const forwardX =
            Math.cos(this.angle);

        const forwardY =
            Math.sin(this.angle);


        const rightX =
            -Math.sin(this.angle);

        const rightY =
            Math.cos(this.angle);


        // ----------------------------------------
        // MOVEMENT VECTOR
        // ----------------------------------------

        let dx =
            (
                forwardX * forward
            ) +
            (
                rightX * strafe
            );


        let dy =
            (
                forwardY * forward
            ) +
            (
                rightY * strafe
            );


        // ----------------------------------------
        // NORMALIZE
        // ----------------------------------------

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            length <= 0
        ) {

            return;
        }


        dx /=
            length;

        dy /=
            length;


        // ----------------------------------------
        // APPLY SPEED
        // ----------------------------------------

        dx *=
            speed *
            deltaTime;

        dy *=
            speed *
            deltaTime;


        // ----------------------------------------
        // MOVE
        // ----------------------------------------

        this.move(
            dx,
            dy
        );
    }


    // ========================================
    // MOVE
    // ========================================

    move(
        dx,
        dy
    ) {

        const newX =
            this.x + dx;

        const newY =
            this.y + dy;


        // ----------------------------------------
        // X AXIS
        // ----------------------------------------

        if (
            !this.collides(
                newX,
                this.y
            )
        ) {

            this.x =
                newX;
        }


        // ----------------------------------------
        // Y AXIS
        // ----------------------------------------

        if (
            !this.collides(
                this.x,
                newY
            )
        ) {

            this.y =
                newY;
        }
    }


    // ========================================
    // COLLISION
    // ========================================

    collides(
        x,
        y
    ) {

        // ----------------------------------------
        // WORLD NOT CONNECTED
        // ----------------------------------------

        if (
            !this.world
        ) {

            return false;
        }


        // ----------------------------------------
        // isSolid()
        // ----------------------------------------

        if (
            typeof this.world.isSolid ===
            "function"
        ) {

            return (
                this.world.isSolid(
                    x - this.radius,
                    y - this.radius
                ) ||

                this.world.isSolid(
                    x + this.radius,
                    y - this.radius
                ) ||

                this.world.isSolid(
                    x - this.radius,
                    y + this.radius
                ) ||

                this.world.isSolid(
                    x + this.radius,
                    y + this.radius
                )
            );
        }


        // ----------------------------------------
        // isBlocked()
        // ----------------------------------------

        if (
            typeof this.world.isBlocked ===
            "function"
        ) {

            return (
                this.world.isBlocked(
                    x - this.radius,
                    y - this.radius
                ) ||

                this.world.isBlocked(
                    x + this.radius,
                    y - this.radius
                ) ||

                this.world.isBlocked(
                    x - this.radius,
                    y + this.radius
                ) ||

                this.world.isBlocked(
                    x + this.radius,
                    y + this.radius
                )
            );
        }


        // ----------------------------------------
        // NO COLLISION API
        // ----------------------------------------

        return false;
    }


    // ========================================
    // SET WORLD
    // ========================================

    setWorld(
        world
    ) {

        this.world =
            world;
    }


    // ========================================
    // RESET
    // ========================================

    reset(
        x = 12.5,
        y = 12.5,
        angle = 0
    ) {

        this.x =
            x;

        this.y =
            y;

        this.angle =
            angle;


        // Normalize angle
        this.angle =
            this.angle %
            (Math.PI * 2);


        if (
            this.angle < 0
        ) {

            this.angle +=
                Math.PI * 2;
        }


        // Reset camera
        this.pitch = 0;
    }


    // ========================================
    // GET POSITION
    // ========================================

    getPosition() {

        return {

            x: this.x,

            y: this.y,

            angle: this.angle
        };
    }


    // ========================================
    // GET DIRECTION
    // ========================================

    getDirection() {

        return {

            x: Math.cos(
                this.angle
            ),

            y: Math.sin(
                this.angle
            )
        };
    }


    // ========================================
    // GET FORWARD VECTOR
    // ========================================

    getForwardVector() {

        return {

            x:
                Math.cos(
                    this.angle
                ),

            y:
                Math.sin(
                    this.angle
                )
        };
    }


    // ========================================
    // GET RIGHT VECTOR
    // ========================================

    getRightVector() {

        return {

            x:
                -Math.sin(
                    this.angle
                ),

            y:
                Math.cos(
                    this.angle
                )
        };
    }
}

