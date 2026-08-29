// ============================================
// INPUT.JS
// ============================================

export class Input {

    constructor(canvas) {

        this.canvas = canvas;

        this.keys = new Set();

        this.mouseSensitivity = 0.003;

        this.mouseDelta = 0;

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
            event => {

                this.keys.add(
                    event.code
                );
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


    // ========================================
    // CHECK KEY
    // ========================================

    isDown(code) {

        return this.keys.has(code);
    }


    // ========================================
    // GET MOUSE ROTATION
    // ========================================

    consumeMouseDelta() {

        const value =
            this.mouseDelta;

        this.mouseDelta = 0;

        return value;
    }
}