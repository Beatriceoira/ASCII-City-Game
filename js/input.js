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


    // ========================================
    // KEYBOARD
    // ========================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

                this.keys.add(event.code);

                // Prevent browser scrolling
                // when using movement keys.

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
                    ].includes(event.code)
                ) {

                    event.preventDefault();
                }
            }
        );


        window.addEventListener(
            "keyup",
            (event) => {

                this.keys.delete(event.code);
            }
        );


        // Important:
        // Clear keys if the browser loses focus.

        window.addEventListener(
            "blur",
            () => {

                this.keys.clear();
            }
        );
    }


    // ========================================
    // MOUSE
    // ========================================

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
            (event) => {

                if (!this.pointerLocked) {
                    return;
                }

                this.mouseDelta +=
                    event.movementX *
                    this.mouseSensitivity;
            }
        );
    }


    // ========================================
    // CHECK KEY
    // ========================================

    isDown(code) {

        return this.keys.has(code);
    }


    // ========================================
    // MOUSE DELTA
    // ========================================

    consumeMouseDelta() {

        const value =
            this.mouseDelta;

        this.mouseDelta = 0;

        return value;
    }
}