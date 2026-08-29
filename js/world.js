// ============================================
// WORLD.JS — VERSION 4
// PROCEDURAL CITY GENERATOR
// ============================================


export const TILE_SIZE = 1;

export const WORLD_WIDTH = 80;

export const WORLD_HEIGHT = 80;


// ============================================
// TILE TYPES
// ============================================

export const TILE = {

    ROAD: ".",

    SIDEWALK: "s",

    BUILDING: "#",

    PARK: "p"

};


// ============================================
// SEEDED RANDOM
// ============================================

export class Random {

    constructor(seed = 12345) {

        this.seed =
            seed >>> 0;
    }


    next() {

        this.seed =
            (
                this.seed *
                1664525 +
                1013904223
            ) >>> 0;


        return (
            this.seed /
            4294967296
        );
    }


    range(
        min,
        max
    ) {

        return (
            min +
            this.next() *
            (
                max - min
            )
        );
    }


    int(
        min,
        max
    ) {

        return Math.floor(
            this.range(
                min,
                max + 1
            )
        );
    }


    chance(
        probability
    ) {

        return (
            this.next() <
            probability
        );
    }


    pick(
        array
    ) {

        return array[
            this.int(
                0,
                array.length - 1
            )
        ];
    }
}


// ============================================
// CITY DATA
// ============================================

export let WORLD_MAP = [];

export let buildings = [];

export let treeSpawns = [];

export let carSpawns = [];

export let pedestrianSpawns = [];

export let streetLights = [];

export let trafficLights = [];

export let parks = [];


// ============================================
// CITY SEED
// ============================================

export let currentSeed =
    20260324;


// ============================================
// EMPTY MAP
// ============================================

function createEmptyMap() {

    WORLD_MAP = [];


    for (
        let y = 0;
        y < WORLD_HEIGHT;
        y++
    ) {

        WORLD_MAP[y] =
            new Array(
                WORLD_WIDTH
            ).fill(
                TILE.BUILDING
            );
    }
}


// ============================================
// SET TILE
// ============================================

function setTile(
    x,
    y,
    tile
) {

    if (
        x < 0 ||
        x >= WORLD_WIDTH ||
        y < 0 ||
        y >= WORLD_HEIGHT
    ) {

        return;
    }


    WORLD_MAP[y][x] =
        tile;
}


// ============================================
// GENERATE ROADS
// ============================================

function generateRoads(
    random
) {

    const verticalRoads = [
        10,
        20,
        30,
        40,
        50,
        60,
        70
    ];


    const horizontalRoads = [
        10,
        20,
        30,
        40,
        50,
        60,
        70
    ];


    for (
        const x
        of verticalRoads
    ) {

        for (
            let y = 0;
            y < WORLD_HEIGHT;
            y++
        ) {

            setTile(
                x,
                y,
                TILE.ROAD
            );


            if (
                x > 0
            ) {

                setTile(
                    x - 1,
                    y,
                    TILE.SIDEWALK
                );
            }


            if (
                x <
                WORLD_WIDTH - 1
            ) {

                setTile(
                    x + 1,
                    y,
                    TILE.SIDEWALK
                );
            }
        }
    }


    for (
        const y
        of horizontalRoads
    ) {

        for (
            let x = 0;
            x < WORLD_WIDTH;
            x++
        ) {

            setTile(
                x,
                y,
                TILE.ROAD
            );


            if (
                y > 0
            ) {

                setTile(
                    x,
                    y - 1,
                    TILE.SIDEWALK
                );
            }


            if (
                y <
                WORLD_HEIGHT - 1
            ) {

                setTile(
                    x,
                    y + 1,
                    TILE.SIDEWALK
                );
            }
        }
    }
}


// ============================================
// GENERATE BLOCKS
// ============================================

function generateBlocks(
    random
) {

    buildings = [];


    const blockSize = 10;

    const roadWidth = 3;


    for (
        let blockY = 0;
        blockY < 7;
        blockY++
    ) {

        for (
            let blockX = 0;
            blockX < 7;
            blockX++
        ) {

            const originX =
                blockX *
                blockSize;


            const originY =
                blockY *
                blockSize;


            if (
                random.chance(
                    0.12
                )
            ) {

                generatePark(
                    originX,
                    originY,
                    random
                );

                continue;
            }


            const margin = 2;


            const width =
                random.int(
                    4,
                    7
                );


            const depth =
                random.int(
                    4,
                    7
                );


            const x =
                originX +
                margin;


            const y =
                originY +
                margin;


            const height =
                random.int(
                    4,
                    18
                );


            const type =
                random.pick([
                    "residential",
                    "office",
                    "commercial",
                    "tower"
                ]);


            const building = {

                id:
                    `B${buildings.length
                        .toString()
                        .padStart(
                            3,
                            "0"
                        )}`,

                x,

                y,

                width,

                depth,

                height,

                type,

                windows:
                    true,

                windowRows:
                    Math.max(
                        2,
                        Math.floor(
                            height *
                            0.65
                        )
                    ),

                windowColumns:
                    Math.max(
                        2,
                        width - 1
                    )
            };


            buildings.push(
                building
            );


            // Building footprint.

            for (
                let yy = y;
                yy <
                y + depth;
                yy++
            ) {

                for (
                    let xx = x;
                    xx <
                    x + width;
                    xx++
                ) {

                    setTile(
                        xx,
                        yy,
                        TILE.BUILDING
                    );
                }
            }
        }
    }
}


// ============================================
// PARK
// ============================================

function generatePark(
    originX,
    originY,
    random
) {

    const park = {

        x:
            originX + 2,

        y:
            originY + 2,

        width: 6,

        depth: 6

    };


    parks.push(
        park
    );


    for (
        let y = park.y;
        y <
        park.y +
        park.depth;
        y++
    ) {

        for (
            let x = park.x;
            x <
            park.x +
            park.width;
            x++
        ) {

            setTile(
                x,
                y,
                TILE.PARK
            );


            if (
                random.chance(
                    0.2
                )
            ) {

                treeSpawns.push({

                    x:
                        x + 0.5,

                    y:
                        y + 0.5

                });
            }
        }
    }
}


// ============================================
// STREET LIGHTS
// ============================================

function generateStreetLights() {

    streetLights = [];


    for (
        let x = 5;
        x < WORLD_WIDTH;
        x += 10
    ) {

        for (
            let y = 5;
            y < WORLD_HEIGHT;
            y += 10
        ) {

            streetLights.push({

                x:
                    x + 0.5,

                y:
                    y + 0.5

            });
        }
    }
}


// ============================================
// TRAFFIC LIGHTS
// ============================================

function generateTrafficLights(
    random
) {

    trafficLights = [];


    const intersections = [

        [10, 10],
        [20, 20],
        [30, 30],
        [40, 40],
        [50, 50],
        [60, 60],
        [70, 70],

        [20, 40],
        [40, 20],
        [60, 30]

    ];


    for (
        const [
            x,
            y
        ]
        of intersections
    ) {

        trafficLights.push({

            x:
                x + 1.5,

            y:
                y + 1.5,

            state:
                random.pick([
                    "red",
                    "yellow",
                    "green"
                ])

        });
    }
}


// ============================================
// CARS
// ============================================

function generateCars(
    random
) {

    carSpawns = [];


    const roads = [

        ...[10,20,30,40,50,60,70]
            .map(y => ({
                axis: "horizontal",
                value: y
            })),

        ...[10,20,30,40,50,60,70]
            .map(x => ({
                axis: "vertical",
                value: x
            }))

    ];


    for (
        let i = 0;
        i < 24;
        i++
    ) {

        const road =
            random.pick(
                roads
            );


        if (
            road.axis ===
            "horizontal"
        ) {

            carSpawns.push({

                x:
                    random.range(
                        2,
                        WORLD_WIDTH - 2
                    ),

                y:
                    road.value +
                    0.5,

                angle:
                    random.chance(0.5)
                        ? 0
                        : Math.PI,

                speed:
                    random.range(
                        0.4,
                        1.2
                    )

            });

        } else {

            carSpawns.push({

                x:
                    road.value +
                    0.5,

                y:
                    random.range(
                        2,
                        WORLD_HEIGHT - 2
                    ),

                angle:
                    random.chance(0.5)
                        ? Math.PI / 2
                        : -Math.PI / 2,

                speed:
                    random.range(
                        0.4,
                        1.2
                    )

            });
        }
    }
}


// ============================================
// PEDESTRIANS
// ============================================

function generatePedestrians(
    random
) {

    pedestrianSpawns = [];


    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const x =
            random.int(
                2,
                WORLD_WIDTH - 2
            );


        const y =
            random.int(
                2,
                WORLD_HEIGHT - 2
            );


        if (
            getTile(
                x,
                y
            ) !== TILE.BUILDING
        ) {

            pedestrianSpawns.push({

                x:
                    x + 0.5,

                y:
                    y + 0.5,

                angle:
                    random.range(
                        0,
                        Math.PI * 2
                    ),

                speed:
                    random.range(
                        0.15,
                        0.4
                    )

            });
        }
    }
}


// ============================================
// TREES
// ============================================

function generateTrees(
    random
) {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const x =
            random.int(
                1,
                WORLD_WIDTH - 2
            );


        const y =
            random.int(
                1,
                WORLD_HEIGHT - 2
            );


        const tile =
            getTile(
                x,
                y
            );


        if (
            tile === TILE.SIDEWALK ||
            tile === TILE.PARK
        ) {

            treeSpawns.push({

                x:
                    x + 0.5,

                y:
                    y + 0.5

            });
        }
    }
}


// ============================================
// TILE
// ============================================

export function getTile(
    x,
    y
) {

    const mapX =
        Math.floor(x);


    const mapY =
        Math.floor(y);


    if (
        mapX < 0 ||
        mapX >= WORLD_WIDTH ||
        mapY < 0 ||
        mapY >= WORLD_HEIGHT
    ) {

        return TILE.BUILDING;
    }


    return WORLD_MAP[mapY][mapX];
}


// ============================================
// COLLISION
// ============================================

export function isWall(
    x,
    y
) {

    return (
        getTile(
            x,
            y
        ) === TILE.BUILDING
    );
}


// ============================================
// BUILDING LOOKUP
// ============================================

export function getBuildingAt(
    mapX,
    mapY
) {

    for (
        const building
        of buildings
    ) {

        if (

            mapX >= building.x &&

            mapX <
                building.x +
                building.width &&

            mapY >= building.y &&

            mapY <
                building.y +
                building.depth

        ) {

            return building;
        }
    }


    return null;
}


// ============================================
// GENERATE CITY
// ============================================

export function generateCity(
    seed = currentSeed
) {

    currentSeed =
        Number(seed) || 1;


    const random =
        new Random(
            currentSeed
        );


    buildings = [];

    treeSpawns = [];

    carSpawns = [];

    pedestrianSpawns = [];

    streetLights = [];

    trafficLights = [];

    parks = [];


    createEmptyMap();

    generateRoads(
        random
    );

    generateBlocks(
        random
    );

    generateStreetLights();

    generateTrafficLights(
        random
    );

    generateTrees(
        random
    );

    generateCars(
        random
    );

    generatePedestrians(
        random
    );


    return {

        seed:
            currentSeed,

        buildings,

        treeSpawns,

        carSpawns,

        pedestrianSpawns,

        streetLights,

        trafficLights,

        parks

    };
}


// ============================================
// RANDOM SEED
// ============================================

export function randomSeed() {

    return Math.floor(
        Math.random() *
        999999999
    );
}


// ============================================
// PLAYER SPAWN
// ============================================

export function getPlayerSpawn() {

    return {

        x: 5.5,

        y: 5.5,

        angle:
            Math.PI / 4

    };
}


// ============================================
// INITIAL CITY
// ============================================

generateCity(
    currentSeed
);