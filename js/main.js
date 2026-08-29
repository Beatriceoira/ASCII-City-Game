// ============================================
// MAIN.JS
// ============================================

import {
    playerSpawn
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
// DOM
// ============================================

const canvas =
    document.getElementById(
        "gameCanvas"
    );


const minimapCanvas =
    document.getElementById(
        "minimapCanvas"
    );


const status =
    document.getElementById(
        "status"
    );


// ============================================
// ENGINE
// ============================================

const input =
    new Input(
        canvas
    );


const player =
    new Player(
        playerSpawn.x,
        playerSpawn.y,
        playerSpawn.angle
    );


const raycaster =
    new Raycaster();


const renderer =
    new Renderer(
        canvas,
        minimapCanvas
    );


const entities =
    createEntities();


// ============================================
// GAME STATE
// ============================================

let lastTime =
    performance.now();


let fpsTimer = 0;

let frames = 0;

let fps = 0;


// ============================================
// UPDATE
// ============================================

function update(
    deltaTime
) {

    player.update(
        input,
        deltaTime
    );


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
        raycaster,
        entities
    );
}


// ============================================
// FPS
// ============================================

function updateHUD(
    deltaTime
) {

    frames++;

    fpsTimer +=
        deltaTime;


    if (
        fpsTimer >= 1
    ) {

        fps =
            frames /
            fpsTimer;


        frames = 0;

        fpsTimer = 0;


        status.textContent =
            `FPS ${fps.toFixed(0)} | ` +
            `X ${player.x.toFixed(1)} | ` +
            `Y ${player.y.toFixed(1)}`;
    }
}


// ============================================
// GAME LOOP
// ============================================

function gameLoop(
    timestamp
) {

    const deltaTime =
        Math.min(
            (
                timestamp -
                lastTime
            ) / 1000,

            0.1
        );


    lastTime =
        timestamp;


    update(
        deltaTime
    );


    render();


    updateHUD(
        deltaTime
    );


    requestAnimationFrame(
        gameLoop
    );
}


// ============================================
// START
// ============================================

console.log(
    "ASCII City Version 2"
);

console.log(
    "Engine initialized."
);


requestAnimationFrame(
    gameLoop
);