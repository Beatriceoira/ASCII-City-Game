// ============================================
// WORLD.JS — VERSION 5
// Procedural city + roads + crosswalks + destinations
// ============================================

export const TILE_SIZE = 1;
export const WORLD_WIDTH = 80;
export const WORLD_HEIGHT = 80;

export const TILE = {
    ROAD: ".",
    SIDEWALK: "s",
    BUILDING: "#",
    PARK: "p",
    CROSSWALK: "c"
};

export class Random {
    constructor(seed = 12345) { this.seed = seed >>> 0; }
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
        return this.seed / 4294967296;
    }
    range(min, max) { return min + this.next() * (max - min); }
    int(min, max) { return Math.floor(this.range(min, max + 1)); }
    chance(p) { return this.next() < p; }
    pick(a) { return a[this.int(0, a.length - 1)]; }
}

export let WORLD_MAP = [];
export let buildings = [];
export let treeSpawns = [];
export let carSpawns = [];
export let pedestrianSpawns = [];
export let streetLights = [];
export let trafficLights = [];
export let parks = [];
export let crosswalks = [];
export let destinations = [];
export let roadTiles = [];
export let sidewalkTiles = [];
export let currentSeed = 20260324;

const ROAD_COORDS = [10,20,30,40,50,60,70];

function createEmptyMap() {
    WORLD_MAP = Array.from(
        { length: WORLD_HEIGHT },
        () => new Array(WORLD_WIDTH).fill(TILE.BUILDING)
    );
}

function setTile(x, y, tile) {
    if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) return;
    WORLD_MAP[y][x] = tile;
}

function generateRoads() {
    for (const x of ROAD_COORDS) {
        for (let y = 0; y < WORLD_HEIGHT; y++) {
            setTile(x, y, TILE.ROAD);
            if (x > 0 && WORLD_MAP[y][x - 1] === TILE.BUILDING) setTile(x - 1, y, TILE.SIDEWALK);
            if (x < WORLD_WIDTH - 1 && WORLD_MAP[y][x + 1] === TILE.BUILDING) setTile(x + 1, y, TILE.SIDEWALK);
        }
    }
    for (const y of ROAD_COORDS) {
        for (let x = 0; x < WORLD_WIDTH; x++) {
            setTile(x, y, TILE.ROAD);
            if (y > 0 && WORLD_MAP[y - 1][x] === TILE.BUILDING) setTile(x, y - 1, TILE.SIDEWALK);
            if (y < WORLD_HEIGHT - 1 && WORLD_MAP[y + 1][x] === TILE.BUILDING) setTile(x, y + 1, TILE.SIDEWALK);
        }
    }
    roadTiles = [];
    sidewalkTiles = [];
    for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let x = 0; x < WORLD_WIDTH; x++) {
            if (WORLD_MAP[y][x] === TILE.ROAD) roadTiles.push({x:x+0.5,y:y+0.5});
            if (WORLD_MAP[y][x] === TILE.SIDEWALK) sidewalkTiles.push({x:x+0.5,y:y+0.5});
        }
    }
}

function generateCrosswalks() {
    crosswalks = [];
    for (const x of ROAD_COORDS) {
        for (const y of ROAD_COORDS) {
            // A crosswalk is represented by its intersection center and
            // four pedestrian approach points.
            crosswalks.push({
                id: `CW-${x}-${y}`,
                x: x + 0.5,
                y: y + 0.5,
                width: 3,
                signal: "WALK"
            });
        }
    }
}

function generateBlocks(random) {
    buildings = [];
    parks = [];
    destinations = [];
    treeSpawns = [];

    for (let blockY = 0; blockY < 7; blockY++) {
        for (let blockX = 0; blockX < 7; blockX++) {
            const originX = blockX * 10;
            const originY = blockY * 10;

            if (random.chance(0.14)) {
                const park = { x: originX + 2, y: originY + 2, width: 6, depth: 6 };
                parks.push(park);
                destinations.push({
                    id: `PARK-${parks.length}`,
                    type: "park",
                    x: park.x + park.width / 2,
                    y: park.y + park.depth / 2
                });
                for (let y = park.y; y < park.y + park.depth; y++) {
                    for (let x = park.x; x < park.x + park.width; x++) {
                        setTile(x, y, TILE.PARK);
                        if (random.chance(0.18)) treeSpawns.push({x:x+0.5,y:y+0.5});
                    }
                }
                continue;
            }

            const width = random.int(4, 7);
            const depth = random.int(4, 7);
            const x = originX + 2;
            const y = originY + 2;
            const height = random.int(4, 18);
            const type = random.pick(["residential","office","commercial","restaurant","school","tower"]);

            const building = {
                id: `B${String(buildings.length).padStart(3,"0")}`,
                x, y, width, depth, height, type,
                windows: true,
                windowRows: Math.max(2, Math.floor(height * 0.65)),
                windowColumns: Math.max(2, width - 1)
            };
            buildings.push(building);

            const destinationType =
                type === "residential" ? "home" :
                type === "office" ? "work" :
                type === "school" ? "school" :
                type === "restaurant" ? "restaurant" :
                "shop";

            destinations.push({
                id: building.id,
                type: destinationType,
                x: x + width / 2,
                y: y + depth / 2,
                buildingId: building.id
            });

            for (let yy = y; yy < y + depth; yy++) {
                for (let xx = x; xx < x + width; xx++) setTile(xx, yy, TILE.BUILDING);
            }
        }
    }
}

function generateStreetLights() {
    streetLights = [];
    for (let x = 5; x < WORLD_WIDTH; x += 10) {
        for (let y = 5; y < WORLD_HEIGHT; y += 10) {
            streetLights.push({x:x+0.5,y:y+0.5});
        }
    }
}

function generateTrafficLights(random) {
    trafficLights = [];
    for (const x of ROAD_COORDS) {
        for (const y of ROAD_COORDS) {
            trafficLights.push({
                id: `TL-${x}-${y}`,
                x:x+0.5, y:y+0.5,
                state: random.chance(0.5) ? "green" : "red",
                greenAxis: random.chance(0.5) ? "horizontal" : "vertical",
                timer: random.range(0, 8)
            });
        }
    }
}

function generateInitialCars(random) {
    carSpawns = [];
    for (let i = 0; i < 18; i++) {
        const p = random.pick(roadTiles);
        const horizontal = ROAD_COORDS.includes(Math.floor(p.y));
        carSpawns.push({
            x:p.x, y:p.y,
            angle: horizontal ? (random.chance(0.5) ? 0 : Math.PI) : (random.chance(0.5) ? Math.PI/2 : -Math.PI/2),
            speed: random.range(1.2, 2.6)
        });
    }
}

function generateInitialPedestrians(random) {
    pedestrianSpawns = [];
    for (let i = 0; i < 24; i++) {
        const p = random.pick(sidewalkTiles);
        pedestrianSpawns.push({
            x:p.x, y:p.y,
            angle: random.range(0, Math.PI*2),
            speed: random.range(0.7, 1.2)
        });
    }
}

function generateTrees(random) {
    for (let i = 0; i < 28; i++) {
        const p = random.pick(sidewalkTiles);
        if (!ROAD_COORDS.includes(Math.floor(p.x)) && !ROAD_COORDS.includes(Math.floor(p.y))) {
            treeSpawns.push({x:p.x,y:p.y});
        }
    }
}

export function getTile(x, y) {
    const mx = Math.floor(x), my = Math.floor(y);
    if (mx < 0 || mx >= WORLD_WIDTH || my < 0 || my >= WORLD_HEIGHT) return TILE.BUILDING;
    return WORLD_MAP[my][mx];
}

export function isWall(x, y) { return getTile(x,y) === TILE.BUILDING; }
export function isSolid(x, y) { return isWall(x,y); }
export function isRoad(x,y) {
    const t = getTile(x,y);
    return t === TILE.ROAD || t === TILE.CROSSWALK;
}
export function isWalkable(x,y) { return getTile(x,y) !== TILE.BUILDING; }

export function getBuildingAt(mapX, mapY) {
    for (const building of buildings) {
        if (
            mapX >= building.x && mapX < building.x + building.width &&
            mapY >= building.y && mapY < building.y + building.depth
        ) return building;
    }
    return null;
}

export function getTrafficLightAt(x,y) {
    let best = null, bestD = Infinity;
    for (const light of trafficLights) {
        const d = Math.hypot(light.x-x, light.y-y);
        if (d < bestD) { bestD=d; best=light; }
    }
    return bestD < 2.0 ? best : null;
}

export function getNearestDestination(x,y, type=null) {
    let best = null, bestD = Infinity;
    for (const d of destinations) {
        if (type && d.type !== type) continue;
        const dist = Math.hypot(d.x-x,d.y-y);
        if (dist < bestD) { bestD=dist; best=d; }
    }
    return best;
}

export function generateCity(seed=currentSeed) {
    currentSeed = Number(seed) || 1;
    const random = new Random(currentSeed);

    buildings=[]; treeSpawns=[]; carSpawns=[]; pedestrianSpawns=[];
    streetLights=[]; trafficLights=[]; parks=[]; crosswalks=[];
    destinations=[]; roadTiles=[]; sidewalkTiles=[];

    createEmptyMap();
    generateRoads();
    generateCrosswalks();
    generateBlocks(random);
    generateStreetLights();
    generateTrafficLights(random);
    generateInitialCars(random);
    generateInitialPedestrians(random);
    generateTrees(random);

    return {
        seed:currentSeed, buildings, treeSpawns, carSpawns,
        pedestrianSpawns, streetLights, trafficLights, parks,
        crosswalks, destinations, roadTiles, sidewalkTiles
    };
}

export function randomSeed() {
    return Math.floor(Math.random() * 999999999);
}

export function getPlayerSpawn() {

    if (roadTiles.length === 0) {
        return {
            x: 10.5,
            y: 5.5,
            angle: 0
        };
    }

    // Prefer the first road tile.
    const spawn = roadTiles[0];

    return {
        x: spawn.x,
        y: spawn.y,
        angle: 0
    };
}

generateCity(currentSeed);
