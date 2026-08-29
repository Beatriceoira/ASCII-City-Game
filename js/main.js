// ============================================
// MAIN.JS — VERSION 4
// ============================================

import {
    generateCity,
    randomSeed,
    getPlayerSpawn,
    currentSeed
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


const seedDisplay =
    document.getElementById(
        "seed"
    );


// ============================================
// ENGINE
// ============================================

const input =
    new Input(
        canvas
    );


const raycaster =
    new Raycaster();


const renderer =
    new Renderer(
        canvas,
        minimapCanvas
    );


const spawn =
    getPlayerSpawn();


const player =
    new Player(
        spawn.x,
        spawn.y,
        spawn.angle
    );


let entities =
    createEntities();


// ============================================
// REGENERATE
// ============================================

function regenerateCity() {

    const seed =
        randomSeed();


    generateCity(
        seed
    );


    const spawn =
        getPlayerSpawn();


    player.reset(
        spawn.x,
        spawn.y,
        spawn.angle
    );


    entities =
        createEntities();


    seedDisplay.textContent =
        `SEED: ${seed}`;


    console.log(
        `Generated city with seed ${seed}`
    );
}

// ========================================
// KEYBOARD ACTIONS
// ========================================

window.addEventListener(
    "keydown",
    (event) => {

        // ========================================
        // N — DAY / NIGHT
        // ========================================

        if (
            event.code === "KeyN"
        ) {

            if (
                typeof renderer.toggleNight ===
                "function"
            ) {

                renderer.toggleNight();
            }
        }


        // ========================================
        // R — REGENERATE CITY
        // ========================================

        if (
            event.code === "KeyR"
        ) {

            regenerateCity();
        }
    }
);

// ============================================
// EVENTS
// ============================================

window.addEventListener(
    "regenerate-city",
    regenerateCity
);


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
    deltaTime,
    input
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
    "ASCII CITY — VERSION 4"
);

console.log(
    "================================"
);

console.log(
    "Procedural Generation: ONLINE"
);

console.log(
    "Seeded World: ONLINE"
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


seedDisplay.textContent =
    `SEED: ${currentSeed}`;


requestAnimationFrame(
    gameLoop
);