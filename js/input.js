// ============================================
// INPUT.JS
// ============================================


export class Input {

    constructor(canvas) {

        this.canvas = canvas;

        this.keys = new Set();

        this.mouseDelta = 0;

        this.mouseSensitivity = 0.0025;

        this.pointerLocked = false;

        this.setupKeyboard();

        this.setupMouse();
    }


    setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                this.keys.add(
                    event.code
                );


                if (
                    [
                        "KeyW",
                        "KeyA",
                        "KeyS",
                        "KeyD",

                        "ArrowUp",
                        "ArrowDown",

                        "ArrowLeft",
                        "ArrowRight",

                        "Space"
                    ].includes(
                        event.code
                    )
                ) {

                    event.preventDefault();
                }


                // Toggle night mode.

                if (
                    event.code === "KeyN" &&
                    !event.repeat
                ) {

                    window.dispatchEvent(
                        new CustomEvent(
                            "toggle-night"
                        )
                    );
                }
            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys.delete(
                    event.code
                );
            }
        );


        window.addEventListener(
            "blur",
            () => {

                this.keys.clear();
            }
        );
    }


    setupMouse() {

        this.canvas.addEventListener(
            "click",
            () => {

                this.canvas.requestPointerLock();
            }
        );


        document.addEventListener(
            "pointerlockchange",
            () => {

                this.pointerLocked =
                    document.pointerLockElement ===
                    this.canvas;
            }
        );


        document.addEventListener(
            "mousemove",
            event => {

                if (
                    !this.pointerLocked
                ) {

                    return;
                }


                this.mouseDelta +=
                    event.movementX *
                    this.mouseSensitivity;
            }
        );
    }


    isDown(code) {

        return this.keys.has(code);
    }


    consumeMouseDelta() {

        const value =
            this.mouseDelta;

        this.mouseDelta = 0;

        return value;
    }
}