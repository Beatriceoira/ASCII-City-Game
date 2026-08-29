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


const timeDisplay =
    document.getElementById(
        "time"
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
// STATE
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
// HUD
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


        timeDisplay.textContent =
            renderer.night
                ? "NIGHT"
                : "DAY";
    }
}


// ============================================
// LOOP
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
    "================================"
);

console.log(
    "ASCII CITY — VERSION 3"
);

console.log(
    "================================"
);

console.log(
    "Raycasting: ONLINE"
);

console.log(
    "Depth Buffer: ONLINE"
);

console.log(
    "Dynamic Entities: ONLINE"
);

console.log(
    "Dynamic Lighting: ONLINE"
);

console.log(
    "Day/Night Cycle: ONLINE"
);

console.log(
    "ASCII CITY MAIN.JS STARTED"
);

requestAnimationFrame(
    gameLoop
);