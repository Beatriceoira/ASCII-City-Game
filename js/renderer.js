// ============================================
// RENDERER.JS
// ============================================

import {
    buildings,
    WORLD_MAP,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    roadMarkings,
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


        this.columns = 110;

        this.rows = 55;


        this.night = false;


        this.resize();


        window.addEventListener(
            "resize",
            () => this.resize()
        );


        window.addEventListener(
            "toggle-night",
            () => {

                this.night =
                    !this.night;
            }
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
            `${Math.floor(
                this.cellHeight
            )}px monospace`;


        this.ctx.textAlign =
            "center";


        this.ctx.textBaseline =
            "middle";
    }


    // ========================================
    // FRAME
    // ========================================

    createFrame() {

        const size =
            this.columns *
            this.rows;


        this.characters =
            new Array(size);


        this.colors =
            new Array(size);


        this.depthBuffer =
            new Array(
                this.columns
            );


        for (
            let i = 0;
            i < size;
            i++
        ) {

            this.characters[i] =
                " ";

            this.colors[i] =
                "rgb(0,0,0)";
        }


        for (
            let x = 0;
            x < this.columns;
            x++
        ) {

            this.depthBuffer[x] =
                Infinity;
        }
    }


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
    // SKY
    // ========================================

    drawSky() {

        const horizon =
            Math.floor(
                this.rows / 2
            );


        for (
            let y = 0;
            y < horizon;
            y++
        ) {

            const t =
                y /
                horizon;


            let brightness;


            if (
                this.night
            ) {

                brightness =
                    0.025 +
                    (
                        1 - t
                    ) *
                    0.025;

            } else {

                brightness =
                    0.04 +
                    (
                        1 - t
                    ) *
                    0.08;
            }


            const value =
                Math.floor(
                    brightness *
                    255
                );


            const color =
                `rgb(${value},${value},${value})`;


            for (
                let x = 0;
                x < this.columns;
                x++
            ) {

                this.characters[
                    this.index(
                        x,
                        y
                    )
                ] = " ";

                this.colors[
                    this.index(
                        x,
                        y
                    )
                ] = color;
            }
        }
    }


    // ========================================
    // GROUND
    // ========================================

    drawGround() {

        const horizon =
            Math.floor(
                this.rows / 2
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
                    ? 0.025 - t * 0.015
                    : 0.13 - t * 0.08;


            const value =
                Math.floor(
                    brightness *
                    255
                );


            const color =
                `rgb(${value},${value},${value})`;


            const character =
                t > 0.65
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
    // WALLS
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
                cameraX * FOV;


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
                0.85;


            const center =
                this.rows / 2;


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


            // Building windows.

            if (
                building &&
                building.windows
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
    // WINDOWS
    // ========================================

    renderWindows(
        column,
        top,
        bottom,
        depth,
        building
    ) {

        const height =
            bottom - top;


        if (
            height < 8
        ) {

            return;
        }


        const rows =
            Math.min(
                building.windowRows,
                Math.floor(
                    height / 6
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
                        (
                            column * 7 +
                            i * 13
                        ) %
                        5
                    ) !== 0;


                if (
                    lit
                ) {

                    this.put(
                        column,
                        y,
                        "[]",
                        "rgb(220,180,80)",
                        depth - 0.001
                    );
                }

            } else {

                this.put(
                    column,
                    y,
                    ".",
                    "rgb(100,100,100)",
                    depth - 0.001
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


        let result = 0;


        for (
            const light
            of entities.lights
        ) {

            const dx =
                light.x - x;


            const dy =
                light.y - y;


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
    // ENTITIES
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
                player,
                entities
            );
        }
    }


    // ========================================
    // ENTITY
    // ========================================

    renderEntity(
        entity,
        player,
        entities
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
            distance < 0.1 ||
            distance > 28
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
            FOV / 2 + 0.15
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
            0.65;


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


        const centerY =
            this.rows / 2;


        const top =
            Math.floor(
                centerY -
                height / 2
            );


        const bottom =
            Math.floor(
                centerY +
                height / 2
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


        const brightness =
            calculateBrightness(
                correctedDistance,
                28,
                0,
                this.night,
                0
            );


        let color =
            brightnessToColor(
                brightness,
                this.night
            );


        if (
            entity.type ===
            "streetLight"
        ) {

            color =
                lightColor(
                    brightness
                );
        }


        if (
            entity.type ===
            "trafficLight"
        ) {

            color =
                this.trafficColor(
                    entity.state,
                    brightness
                );
        }


        const sprite =
            this.getSprite(
                entity.type
            );


        this.drawSprite(
            sprite,
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

    getSprite(type) {

        switch (type) {

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

                    "  ___ ",

                    " /   |",

                    "/    |",

                    "     |",

                    "     |",

                    "     |",

                    "     |"

                ];


            case "trafficLight":

                return [

                    " | ",

                    "[R]",

                    "[Y]",

                    "[G]",

                    " | ",

                    " | "

                ];


            default:

                return ["?"];
        }
    }


    // ========================================
    // SPRITE DRAW
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

        const spriteHeight =
            sprite.length;


        const spriteWidth =
            Math.max(
                ...sprite.map(
                    line =>
                        line.length
                )
            );


        for (
            let sy = 0;
            sy < spriteHeight;
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
                            spriteWidth
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
                            spriteHeight
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
    // TRAFFIC COLOR
    // ========================================

    trafficColor(
        state,
        brightness
    ) {

        const amount =
            Math.floor(
                70 +
                brightness * 180
            );


        if (
            state === "red"
        ) {

            return `rgb(${amount},40,40)`;
        }


        if (
            state === "yellow"
        ) {

            return `rgb(${amount},${amount},30)`;
        }


        return `rgb(40,${amount},60)`;
    }


    // ========================================
    // FLUSH
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


                ctx.fillStyle =
                    tile === "#"
                        ? "#777"
                        : "#111";


                ctx.fillRect(
                    x * scaleX,
                    y * scaleY,
                    scaleX + 1,
                    scaleY + 1
                );
            }
        }


        // Road markings.

        ctx.strokeStyle =
            "#555";


        ctx.lineWidth = 1;


        for (
            const road
            of roadMarkings
        ) {

            ctx.beginPath();

            ctx.moveTo(
                road.x1 * scaleX,
                road.y1 * scaleY
            );

            ctx.lineTo(
                road.x2 * scaleX,
                road.y2 * scaleY
            );

            ctx.stroke();
        }


        // Player.

        const px =
            player.x *
            scaleX;


        const py =
            player.y *
            scaleY;


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
            ) * 14,

            py +
            Math.sin(
                player.angle
            ) * 14
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