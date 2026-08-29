// ============================================
// MAIN.JS
// ============================================

import {
    spawnPoints
} from "./world.js";

import {
    Player
} from "./player.js";

import {
    Input
} from "./input.js";

import {
    Raycaster
} from "./raycaster.js";

import {
    Renderer
} from "./renderer.js";

import {
    createEntities,
    updateEntities
} from "./entities.js";


// ============================================
// CANVAS
// ============================================

const canvas =
    document.getElementById(
        "gameCanvas"
    );


// ============================================
// ENGINE COMPONENTS
// ============================================

const player =
    new Player(
        spawnPoints.player.x,
        spawnPoints.player.y,
        spawnPoints.player.angle
    );


const input =
    new Input(canvas);


const raycaster =
    new Raycaster();


const renderer =
    new Renderer(canvas);


const entities =
    createEntities();


// ============================================
// GAME STATE
// ============================================

let lastTime = performance.now();

let fps = 0;

let fpsTimer = 0;

let frameCount = 0;


// ============================================
// HUD
// ============================================

const status =
    document.getElementById(
        "status"
    );


// ============================================
// UPDATE
// ============================================

function update(deltaTime) {

    let forward = 0;

    let strafe = 0;


    // -------------------------------
    // Movement
    // -------------------------------

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


    player.move(
        forward,
        strafe,
        deltaTime
    );


    // -------------------------------
    // Keyboard rotation
    // -------------------------------

    if (
        input.isDown("ArrowLeft")
    ) {

        player.rotate(
            -1,
            deltaTime
        );
    }


    if (
        input.isDown("ArrowRight")
    ) {

        player.rotate(
            1,
            deltaTime
        );
    }


    // -------------------------------
    // Mouse rotation
    // -------------------------------

    const mouseRotation =
        input.consumeMouseDelta();


    player.angle +=
        mouseRotation;


    // -------------------------------
    // Entities
    // -------------------------------

    updateEntities(
        entities,
        deltaTime
    );
}


// ============================================
// RENDER
// ============================================

function render() {

    renderer.render(
        player,
        raycaster
    );


    // Render trees

    for (
        const tree
        of entities.trees
    ) {

        renderer.drawEntity(
            tree,
            player
        );
    }


    // Render cars

    for (
        const car
        of entities.cars
    ) {

        renderer.drawEntity(
            car,
            player
        );
    }


    // Render pedestrians

    for (
        const pedestrian
        of entities.pedestrians
    ) {

        renderer.drawEntity(
            pedestrian,
            player
        );
    }
}


// ============================================
// FPS
// ============================================

function updateFPS(deltaTime) {

    frameCount++;

    fpsTimer += deltaTime;


    if (
        fpsTimer >= 1
    ) {

        fps =
            frameCount /
            fpsTimer;


        frameCount = 0;

        fpsTimer = 0;


        status.textContent =
            `FPS: ${fps.toFixed(0)} | ` +
            `POS: ${player.x.toFixed(1)}, ` +
            `${player.y.toFixed(1)}`;
    }
}


// ============================================
// MAIN LOOP
// ============================================

function gameLoop(timestamp) {

    const deltaTime =
        Math.min(
            (timestamp - lastTime) /
            1000,
            0.1
        );


    lastTime =
        timestamp;


    update(
        deltaTime
    );


    render();


    updateFPS(
        deltaTime
    );


    requestAnimationFrame(
        gameLoop
    );
}


// ============================================
// START
// ============================================

requestAnimationFrame(
    gameLoop
);