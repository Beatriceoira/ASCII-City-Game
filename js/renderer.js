// ============================================
// RENDERER.JS — VERSION 5
// ============================================

import {
    buildings,
    WORLD_MAP,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    TILE,
    getBuildingAt
} from "./world.js";


import {
    calculateBrightness,
    brightnessToASCII,
    brightnessToColor,
    lightColor,
    pointLight
} from "./lighting.js";


export class Renderer {

    // ========================================
    // CONSTRUCTOR
    // ========================================

    constructor(
        canvas,
        minimapCanvas
    ) {

        this.canvas =
            canvas;

        this.ctx =
            canvas.getContext(
                "2d"
            );


        this.minimapCanvas =
            minimapCanvas;

        this.minimapCtx =
            minimapCanvas.getContext(
                "2d"
            );


        // ========================================
        // RENDER RESOLUTION
        // ========================================

        this.columns =
            120;

        this.rows =
            60;


        // ========================================
        // DAY / NIGHT
        // ========================================

        this.night =
            false;


        // ========================================
        // INITIAL RESIZE
        // ========================================

        this.resize();


        // ========================================
        // WINDOW RESIZE
        // ========================================

        window.addEventListener(
            "resize",
            () => this.resize()
        );


        // ========================================
        // DAY / NIGHT EVENT
        // ========================================

        window.addEventListener(
            "toggle-night",
            () => {

                this.toggleNight();
            }
        );
    }


    // ========================================
    // TOGGLE NIGHT
    // ========================================

    toggleNight() {

        this.night =
            !this.night;

        console.log(
            this.night
                ? "Night mode: ON"
                : "Night mode: OFF"
        );
    }


    // ========================================
    // RESIZE
    // ========================================

    resize() {

        this.canvas.width =
            window.innerWidth;

        this.canvas.height =
            window.innerHeight;


        this.cellWidth =
            this.canvas.width /
            this.columns;


        this.cellHeight =
            this.canvas.height /
            this.rows;


        this.ctx.font =
            `${Math.max(
                8,
                Math.floor(
                    this.cellHeight *
                    1.15
                )
            )}px monospace`;


        this.ctx.textAlign =
            "center";


        this.ctx.textBaseline =
            "middle";
    }


    // ========================================
    // CREATE FRAME
    // ========================================

    createFrame() {

        const size =
            this.columns *
            this.rows;


        this.characters =
            new Array(
                size
            ).fill(
                " "
            );


        this.colors =
            new Array(
                size
            ).fill(
                "rgb(0,0,0)"
            );


        this.depthBuffer =
            new Array(
                this.columns
            ).fill(
                Infinity
            );
    }


    // ========================================
    // ARRAY INDEX
    // ========================================

    index(
        x,
        y
    ) {

        return (
            y *
            this.columns +
            x
        );
    }


    // ========================================
    // PUT CHARACTER
    // ========================================

    put(
        x,
        y,
        character,
        color,
        depth
    ) {

        if (
            x < 0 ||
            x >= this.columns ||
            y < 0 ||
            y >= this.rows
        ) {

            return;
        }


        if (
            depth >
            this.depthBuffer[x]
        ) {

            return;
        }


        const index =
            this.index(
                x,
                y
            );


        this.characters[index] =
            character;

        this.colors[index] =
            color;

        this.depthBuffer[x] =
            depth;
    }


    // ========================================
    // DRAW SKY
    // ========================================

    drawSky() {

        const horizon =
            Math.floor(
                this.rows *
                0.48
            );


        for (
            let y = 0;
            y < horizon;
            y++
        ) {

            const t =
                y /
                horizon;


            const brightness =
                this.night
                    ? 0.015 +
                      (1 - t) * 0.025

                    : 0.04 +
                      (1 - t) * 0.1;


            const value =
                Math.floor(
                    brightness *
                    255
                );


            const color =
                `rgb(
                    ${value},
                    ${value},
                    ${value}
                )`.replace(
                    /\s/g,
                    ""
                );


            for (
                let x = 0;
                x < this.columns;
                x++
            ) {

                const index =
                    this.index(
                        x,
                        y
                    );


                this.colors[index] =
                    color;
            }
        }
    }


    // ========================================
    // DRAW GROUND
    // ========================================

    drawGround() {

        const horizon =
            Math.floor(
                this.rows *
                0.48
            );


        for (
            let y = horizon;
            y < this.rows;
            y++
        ) {

            const t =
                (
                    y -
                    horizon
                ) /
                (
                    this.rows -
                    horizon
                );


            const brightness =
                this.night
                    ? 0.025 -
                      t * 0.015

                    : 0.12 -
                      t * 0.07;


            const value =
                Math.floor(
                    brightness *
                    255
                );


            const color =
                `rgb(
                    ${value},
                    ${value},
                    ${value}
                )`.replace(
                    /\s/g,
                    ""
                );


            const character =
                t > 0.7
                    ? ":"
                    : ".";


            for (
                let x = 0;
                x < this.columns;
                x++
            ) {

                const index =
                    this.index(
                        x,
                        y
                    );


                if (
                    this.characters[index] ===
                    " "
                ) {

                    this.characters[index] =
                        character;

                    this.colors[index] =
                        color;
                }
            }
        }
    }


    // ========================================
    // RENDER WALLS
    // ========================================

    renderWalls(
        player,
        raycaster,
        entities
    ) {

        const FOV =
            Math.PI / 3;


        for (
            let column = 0;
            column < this.columns;
            column++
        ) {

            const cameraX =
                column /
                (
                    this.columns - 1
                );


            const rayAngle =
                player.angle -
                FOV / 2 +
                cameraX *
                FOV;


            const ray =
                raycaster.castRay(
                    player.x,
                    player.y,
                    rayAngle
                );


            if (
                !ray.hit
            ) {

                continue;
            }


            const correctedDistance =
                ray.distance *
                Math.cos(
                    rayAngle -
                    player.angle
                );


            const building =
                getBuildingAt(
                    ray.mapX,
                    ray.mapY
                );


            const height =
                building
                    ? building.height
                    : 5;


            const projectedHeight =
                (
                    height /
                    correctedDistance
                ) *
                this.rows *
                0.82;


            const center =
                this.rows *
                0.48;


            const top =
                Math.floor(
                    center -
                    projectedHeight
                );


            const bottom =
                Math.floor(
                    center
                );


            const localLight =
                this.getLocalLight(
                    ray.hitX,
                    ray.hitY,
                    entities
                );


            const brightness =
                calculateBrightness(
                    correctedDistance,
                    raycaster.maxDepth,
                    ray.side,
                    this.night,
                    localLight
                );


            const character =
                brightnessToASCII(
                    brightness
                );


            const color =
                brightnessToColor(
                    brightness,
                    this.night
                );


            for (
                let row = top;
                row <= bottom;
                row++
            ) {

                this.put(
                    column,
                    row,
                    character,
                    color,
                    correctedDistance
                );
            }


            if (
                building
            ) {

                this.renderWindows(
                    column,
                    top,
                    bottom,
                    correctedDistance,
                    building
                );
            }
        }
    }


    // ========================================
    // RENDER WINDOWS
    // ========================================

    renderWindows(
        column,
        top,
        bottom,
        depth,
        building
    ) {

        const height =
            bottom -
            top;


        if (
            height < 10
        ) {

            return;
        }


        const rows =
            Math.min(
                building.windowRows,
                Math.floor(
                    height /
                    5
                )
            );


        for (
            let i = 1;
            i <= rows;
            i++
        ) {

            const y =
                Math.floor(
                    top +
                    (
                        i /
                        (
                            rows + 1
                        )
                    ) *
                    height
                );


            if (
                this.night
            ) {

                const lit =
                    (
                        column * 11 +
                        i * 7 +
                        building.height
                    ) % 6 !== 0;


                if (
                    lit
                ) {

                    this.put(
                        column,
                        y,
                        "□",
                        "rgb(220,185,90)",
                        depth -
                        0.002
                    );
                }

            } else {

                this.put(
                    column,
                    y,
                    ".",
                    "rgb(90,90,90)",
                    depth -
                    0.002
                );
            }
        }
    }


    // ========================================
    // LOCAL LIGHT
    // ========================================

    getLocalLight(
        x,
        y,
        entities
    ) {

        if (
            !this.night
        ) {

            return 0;
        }


        let result =
            0;


        if (
            !entities ||
            !entities.lights
        ) {

            return 0;
        }


        for (
            const light
            of entities.lights
        ) {

            const dx =
                light.x -
                x;


            const dy =
                light.y -
                y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            result +=
                pointLight(
                    distance,
                    light.radius
                );
        }


        return Math.min(
            result,
            1
        );
    }


    // ========================================
    // RENDER ENTITIES
    // ========================================

    renderEntities(
        entities,
        player
    ) {

        const all = [

            ...entities.trees,

            ...entities.cars,

            ...entities.pedestrians,

            ...entities.lights,

            ...entities.traffic

        ];


        all.sort(
            (a, b) =>
                b.distanceTo(player) -
                a.distanceTo(player)
        );


        for (
            const entity
            of all
        ) {

            this.renderEntity(
                entity,
                player
            );
        }
    }


    // ========================================
    // RENDER ENTITY
    // ========================================

    renderEntity(
        entity,
        player
    ) {

        const dx =
            entity.x -
            player.x;


        const dy =
            entity.y -
            player.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            0.1 ||
            distance >
            35
        ) {

            return;
        }


        let angle =
            Math.atan2(
                dy,
                dx
            ) -
            player.angle;


        while (
            angle > Math.PI
        ) {

            angle -=
                Math.PI * 2;
        }


        while (
            angle < -Math.PI
        ) {

            angle +=
                Math.PI * 2;
        }


        const FOV =
            Math.PI / 3;


        if (
            Math.abs(angle) >
            FOV / 2 +
            0.2
        ) {

            return;
        }


        const screenX =
            (
                angle /
                FOV +
                0.5
            ) *
            this.columns;


        const correctedDistance =
            distance *
            Math.cos(angle);


        if (
            correctedDistance <= 0
        ) {

            return;
        }


        const height =
            (
                entity.height /
                correctedDistance
            ) *
            this.rows *
            0.62;


        const width =
            Math.max(
                1,
                (
                    entity.width /
                    correctedDistance
                ) *
                this.columns *
                0.45
            );


        const center =
            this.rows *
            0.48;


        const top =
            Math.floor(
                center -
                height
            );


        const bottom =
            Math.floor(
                center
            );


        const left =
            Math.floor(
                screenX -
                width / 2
            );


        const right =
            Math.ceil(
                screenX +
                width / 2
            );


        let color =
            brightnessToColor(
                calculateBrightness(
                    correctedDistance,
                    35,
                    0,
                    this.night
                ),
                this.night
            );


        if (
            entity.type ===
            "streetLight"
        ) {

            color =
                lightColor(
                    1
                );
        }


        if (
            entity.type ===
            "trafficLight"
        ) {

            color =
                this.trafficColor(
                    entity.state
                );
        }


        this.drawSprite(
            this.getSprite(
                entity.type
            ),
            left,
            top,
            right,
            bottom,
            color,
            correctedDistance
        );
    }


    // ========================================
    // SPRITES
    // ========================================

    getSprite(
        type
    ) {

        switch (
            type
        ) {

            case "tree":

                return [

                    "   /\\   ",
                    "  /@@\\  ",
                    " /@@@@\\ ",
                    "/@@@@@@\\",
                    "  /@@\\  ",
                    "   ||   ",
                    "   ||   "

                ];


            case "car":

                return [

                    "   ____   ",
                    "  /____\\  ",
                    " /|[][]|\\ ",
                    "| |____| |",
                    " O      O "

                ];


            case "pedestrian":

                return [

                    " O ",
                    "/|\\",
                    "/ \\"

                ];


            case "streetLight":

                return [

                    " ___ ",
                    "/   |",
                    "    |",
                    "    |",
                    "    |",
                    "    |"

                ];


            case "trafficLight":

                return [

                    " | ",
                    "[R]",
                    "[Y]",
                    "[G]",
                    " | "

                ];


            default:

                return [
                    "?"
                ];
        }
    }


    // ========================================
    // DRAW SPRITE
    // ========================================

    drawSprite(
        sprite,
        left,
        top,
        right,
        bottom,
        color,
        depth
    ) {

        const height =
            sprite.length;


        const width =
            Math.max(
                ...sprite.map(
                    line =>
                        line.length
                )
            );


        for (
            let sy = 0;
            sy < height;
            sy++
        ) {

            for (
                let sx = 0;
                sx <
                sprite[sy].length;
                sx++
            ) {

                const char =
                    sprite[sy][sx];


                if (
                    char === " "
                ) {

                    continue;
                }


                const x =
                    left +
                    Math.floor(
                        (
                            sx /
                            width
                        ) *
                        (
                            right -
                            left +
                            1
                        )
                    );


                const y =
                    top +
                    Math.floor(
                        (
                            sy /
                            height
                        ) *
                        (
                            bottom -
                            top +
                            1
                        )
                    );


                this.put(
                    x,
                    y,
                    char,
                    color,
                    depth
                );
            }
        }
    }


    // ========================================
    // TRAFFIC LIGHT COLOR
    // ========================================

    trafficColor(
        state
    ) {

        if (
            state ===
            "red"
        ) {

            return "rgb(240,50,50)";
        }


        if (
            state ===
            "yellow"
        ) {

            return "rgb(240,220,50)";
        }


        return "rgb(50,230,80)";
    }


    // ========================================
    // FLUSH FRAME
    // ========================================

    flush() {

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        for (
            let y = 0;
            y < this.rows;
            y++
        ) {

            for (
                let x = 0;
                x < this.columns;
                x++
            ) {

                const index =
                    this.index(
                        x,
                        y
                    );


                const char =
                    this.characters[index];


                if (
                    char === " "
                ) {

                    continue;
                }


                this.ctx.fillStyle =
                    this.colors[index];


                this.ctx.fillText(
                    char,
                    x *
                        this.cellWidth +
                        this.cellWidth /
                        2,

                    y *
                        this.cellHeight +
                        this.cellHeight /
                        2
                );
            }
        }
    }


    // ========================================
    // MINIMAP
    // ========================================

    renderMinimap(
        player
    ) {

        const canvas =
            this.minimapCanvas;


        const ctx =
            this.minimapCtx;


        canvas.width =
            canvas.clientWidth;


        canvas.height =
            canvas.clientHeight;


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const scaleX =
            canvas.width /
            WORLD_WIDTH;


        const scaleY =
            canvas.height /
            WORLD_HEIGHT;


        for (
            let y = 0;
            y < WORLD_HEIGHT;
            y++
        ) {

            for (
                let x = 0;
                x < WORLD_WIDTH;
                x++
            ) {

                const tile =
                    WORLD_MAP[y][x];


                if (
                    tile ===
                    TILE.BUILDING
                ) {

                    ctx.fillStyle =
                        "#777";

                } else if (
                    tile ===
                    TILE.ROAD
                ) {

                    ctx.fillStyle =
                        "#151515";

                } else if (
                    tile ===
                    TILE.PARK
                ) {

                    ctx.fillStyle =
                        "#263526";

                } else {

                    ctx.fillStyle =
                        "#333";
                }


                ctx.fillRect(
                    x * scaleX,
                    y * scaleY,
                    scaleX + 1,
                    scaleY + 1
                );
            }
        }


        const px =
            player.x *
            scaleX;


        const py =
            player.y *
            scaleY;


        // Player
        ctx.fillStyle =
            "#fff";


        ctx.beginPath();


        ctx.arc(
            px,
            py,
            3,
            0,
            Math.PI * 2
        );


        ctx.fill();


        // Direction
        ctx.strokeStyle =
            "#fff";


        ctx.beginPath();


        ctx.moveTo(
            px,
            py
        );


        ctx.lineTo(
            px +
            Math.cos(
                player.angle
            ) *
            14,

            py +
            Math.sin(
                player.angle
            ) *
            14
        );


        ctx.stroke();
    }


    // ========================================
    // MAIN RENDER
    // ========================================

    render(
        player,
        raycaster,
        entities
    ) {

        this.createFrame();

        this.drawSky();

        this.drawGround();


        this.renderWalls(
            player,
            raycaster,
            entities
        );


        this.renderEntities(
            entities,
            player
        );


        this.flush();


        this.renderMinimap(
            player
        );
    }
}

