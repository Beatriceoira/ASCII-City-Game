// ============================================
// MAIN.JS — VERSION 5
// ============================================

import { generateCity, randomSeed, getPlayerSpawn, currentSeed } from "./world.js";
import { Player } from "./player.js";
import { Input } from "./input.js";
import { Raycaster } from "./raycaster.js";
import { Renderer } from "./renderer.js";
import { createEntities } from "./entities.js";
import { CitySimulation } from "./simulation.js";

const canvas=document.getElementById("gameCanvas");
const minimapCanvas=document.getElementById("minimapCanvas");
const status=document.getElementById("status");
const timeDisplay=document.getElementById("time");
const seedDisplay=document.getElementById("seed");
const populationDisplay=document.getElementById("population");
const trafficDisplay=document.getElementById("traffic");
const pauseDisplay=document.getElementById("pause");

const input=new Input(canvas);
const raycaster=new Raycaster();
const renderer=new Renderer(canvas,minimapCanvas);

let spawn=getPlayerSpawn();
const player=new Player(spawn.x,spawn.y,spawn.angle);
let entities=createEntities();
let simulation=new CitySimulation(entities);

function regenerateCity() {
    const seed=randomSeed();
    generateCity(seed);
    spawn=getPlayerSpawn();
    player.reset(spawn.x,spawn.y,spawn.angle);
    entities=createEntities();
    simulation=new CitySimulation(entities);
    seedDisplay.textContent=`SEED: ${seed}`;
    console.log(`Generated city with seed ${seed}`);
}

function handleAction(event) {
    if(event.repeat)return;
    if(event.code==="KeyN") {
        renderer.toggleNight();
        return;
    }
    if(event.code==="KeyR") {
        regenerateCity();
        return;
    }
    if(event.code==="KeyP") {
        simulation.paused=!simulation.paused;
        pauseDisplay.textContent=simulation.paused?"PAUSED":"RUNNING";
        return;
    }
}

window.addEventListener("keydown",handleAction);
window.addEventListener("regenerate-city",regenerateCity);

let lastTime=performance.now();
let fpsTimer=0,frames=0,fps=0;

function update(dt) {
    if(simulation.paused)return;
    player.update(dt,input);
    simulation.update(dt);
}

function render() {
    renderer.render(player,raycaster,entities);
}

function updateHUD(dt) {
    frames++;fpsTimer+=dt;
    if(fpsTimer>=1) {
        fps=frames/fpsTimer;frames=0;fpsTimer=0;
        status.textContent=
            `FPS ${fps.toFixed(0)} | X ${player.x.toFixed(1)} | Y ${player.y.toFixed(1)}`;
        timeDisplay.textContent=
            `${simulation.getClockString()} ${renderer.night?"NIGHT":"DAY"}`;
        populationDisplay.textContent=
            `POP ${simulation.population.toLocaleString()} | ACTIVE ${simulation.activeWorkers+simulation.activeStudents}`;
        trafficDisplay.textContent=
            `TRAFFIC ${entities.cars.length} | PEDS ${entities.pedestrians.length}`;
    }
}

function gameLoop(timestamp) {
    const dt=Math.min((timestamp-lastTime)/1000,0.1);
    lastTime=timestamp;
    update(dt);
    render();
    updateHUD(dt);
    requestAnimationFrame(gameLoop);
}

console.log("================================");
console.log("ASCII CITY — VERSION 5");
console.log("================================");
console.log("Traffic AI: ONLINE");
console.log("Pedestrian AI: ONLINE");
console.log("Traffic Rules: ONLINE");
console.log("Crosswalks: ONLINE");
console.log("Traffic Signals: ONLINE");
console.log("NPC Destinations: ONLINE");
console.log("Vehicle Spawning: ONLINE");
console.log("Population Simulation: ONLINE");
console.log("A* Pathfinding: ONLINE");
console.log("Raycasting: ONLINE");
console.log("Dynamic Lighting: ONLINE");

seedDisplay.textContent=`SEED: ${currentSeed}`;
pauseDisplay.textContent="RUNNING";
requestAnimationFrame(gameLoop);
