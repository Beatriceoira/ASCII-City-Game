// ========================================
// ASCII CITY — INPUT.JS
// VERSION 5
// ========================================

export class Input {

    constructor(canvas) {

        this.canvas = canvas;

        // ========================================
        // KEYBOARD STATE
        // ========================================

        this.keys = new Set();


        // ========================================
        // MOUSE STATE
        // ========================================

        this.mouseX = 0;
        this.mouseY = 0;

        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;

        this.mouseSensitivity = 0.0025;

        this.pointerLocked = false;


        // ========================================
        // BIND EVENTS
        // ========================================

        this.handleKeyDown =
            this.handleKeyDown.bind(this);

        this.handleKeyUp =
            this.handleKeyUp.bind(this);

        this.handleMouseMove =
            this.handleMouseMove.bind(this);

        this.handlePointerLockChange =
            this.handlePointerLockChange.bind(this);

        this.handleMouseDown =
            this.handleMouseDown.bind(this);


        // ========================================
        // KEYBOARD EVENTS
        // ========================================

        window.addEventListener(
            "keydown",
            this.handleKeyDown
        );

        window.addEventListener(
            "keyup",
            this.handleKeyUp
        );


        // ========================================
        // MOUSE EVENTS
        // ========================================

        window.addEventListener(
            "mousemove",
            this.handleMouseMove
        );

        window.addEventListener(
            "mousedown",
            this.handleMouseDown
        );


        document.addEventListener(
            "pointerlockchange",
            this.handlePointerLockChange
        );


        // ========================================
        // PREVENT STUCK KEYS
        // ========================================

        window.addEventListener(
            "blur",
            () => {
                this.keys.clear();
            }
        );
    }


    // ========================================
    // KEY DOWN
    // ========================================

    handleKeyDown(event) {

        this.keys.add(
            event.code
        );


        // Prevent browser scrolling
        // with movement keys.

        if (
            event.code === "KeyW" ||
            event.code === "KeyA" ||
            event.code === "KeyS" ||
            event.code === "KeyD" ||
            event.code === "KeyQ" ||
            event.code === "KeyE" ||
            event.code === "ArrowUp" ||
            event.code === "ArrowDown" ||
            event.code === "ArrowLeft" ||
            event.code === "ArrowRight" ||
            event.code === "ShiftLeft" ||
            event.code === "ShiftRight" ||
            event.code === "Space"
        ) {

            event.preventDefault();
        }
    }


    // ========================================
    // KEY UP
    // ========================================

    handleKeyUp(event) {

        this.keys.delete(
            event.code
        );
    }


    // ========================================
    // CHECK KEY
    // ========================================

    isDown(code) {

        return this.keys.has(
            code
        );
    }


    // ========================================
    // MOUSE DOWN
    // ========================================

    handleMouseDown(event) {

        // Only capture the mouse when
        // clicking the game canvas.

        if (
            event.target === this.canvas &&
            !this.pointerLocked
        ) {

            this.requestPointerLock();
        }
    }


    // ========================================
    // REQUEST POINTER LOCK
    // ========================================

    requestPointerLock() {

        if (
            !this.canvas
        ) {
            return;
        }


        if (
            document.pointerLockElement !==
            this.canvas
        ) {

            this.canvas.requestPointerLock();
        }
    }


    // ========================================
    // POINTER LOCK CHANGE
    // ========================================

    handlePointerLockChange() {

        this.pointerLocked =
            document.pointerLockElement ===
            this.canvas;


        if (
            !this.pointerLocked
        ) {

            this.mouseDeltaX = 0;
            this.mouseDeltaY = 0;
        }
    }


    // ========================================
    // MOUSE MOVE
    // ========================================

    handleMouseMove(event) {

        if (
            !this.pointerLocked
        ) {
            return;
        }


        this.mouseDeltaX +=
            event.movementX;

        this.mouseDeltaY +=
            event.movementY;


        this.mouseX =
            event.clientX;

        this.mouseY =
            event.clientY;
    }


    // ========================================
    // GET MOUSE DELTA X
    // ========================================

    getMouseDeltaX() {

        const delta =
            this.mouseDeltaX;

        this.mouseDeltaX = 0;

        return delta;
    }


    // ========================================
    // GET MOUSE DELTA Y
    // ========================================

    getMouseDeltaY() {

        const delta =
            this.mouseDeltaY;

        this.mouseDeltaY = 0;

        return delta;
    }


    // ========================================
    // CHECK POINTER LOCK
    // ========================================

    isPointerLocked() {

        return this.pointerLocked;
    }


    // ========================================
    // CLEANUP
    // ========================================

    destroy() {

        window.removeEventListener(
            "keydown",
            this.handleKeyDown
        );

        window.removeEventListener(
            "keyup",
            this.handleKeyUp
        );

        window.removeEventListener(
            "mousemove",
            this.handleMouseMove
        );

        window.removeEventListener(
            "mousedown",
            this.handleMouseDown
        );

        document.removeEventListener(
            "pointerlockchange",
            this.handlePointerLockChange
        );


        this.keys.clear();
    }
}