// ============================================
// RENDERER.JS
// ============================================

import {
    buildings,
    WORLD_MAP,
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./world.js";

import {
    calculateBrightness,
    brightnessToASCII,
    brightnessToColor,
    clamp
} from "./lighting.js";


export class Renderer {

    constructor(
        canvas,
        minimapCanvas
    ) {

        this.canvas = canvas;

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

        this.cellWidth = 8;

        this.cellHeight = 14;


        this.resize();


        window.addEventListener(
            "resize",
            () => this.resize()
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
    // FRAME BUFFER
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

            this.characters[i] = " ";

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


    // ========================================
    // FRAME INDEX
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


        const index =
            this.index(
                x,
                y
            );


        // Depth buffer.

        if (
            depth >
            this.depthBuffer[x]
        ) {

            return;
        }


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

        for (
            let y = 0;
            y < Math.floor(
                this.rows / 2
            );
            y++
        ) {

            const normalized =
                y /
                (this.rows / 2);


            const brightness =
                0.03 +
                (1 - normalized) *
                0.04;


            const value =
                Math.floor(
                    brightness * 255
                );


            const color =
                `rgb(${value},${value},${value})`;


            for (
                let x = 0;
                x < this.columns;
                x++
            ) {

                this.put(
                    x,
                    y,
                    " ",
                    color,
                    Infinity
                );
            }
        }
    }


    // ========================================
    // DRAW GROUND
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

            const distanceFromHorizon =
                (
                    y -
                    horizon
                ) /
                (
                    this.rows -
                    horizon
                );


            const brightness =
                0.16 -
                distanceFromHorizon *
                0.11;


            const value =
                Math.floor(
                    brightness * 255
                );


            const color =
                `rgb(${value},${value},${value})`;


            let character = ".";


            if (
                distanceFromHorizon >
                0.35
            ) {

                character = ",";
            }


            if (
                distanceFromHorizon >
                0.7
            ) {

                character = ":";
            }


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


                // Ground should not
                // overwrite nearer objects.

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
        raycaster
    ) {

        const FOV =
            Math.PI / 3;


        for (
            let column = 0;
            column < this.columns;
            column++
        ) {

            const cameraX =
                (
                    column /
                    (
                        this.columns -
                        1
                    )
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
                this.getBuildingAt(
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


            const brightness =
                calculateBrightness(
                    correctedDistance,
                    raycaster.maxDepth,
                    ray.side
                );


            const character =
                brightnessToASCII(
                    brightness
                );


            const color =
                brightnessToColor(
                    brightness
                );


            for (
                let row = top;
                row <= bottom;
                row++
            ) {

                if (
                    row < 0 ||
                    row >= this.rows
                ) {

                    continue;
                }


                this.put(
                    column,
                    row,
                    character,
                    color,
                    correctedDistance
                );
            }
        }
    }


    // ========================================
    // FIND BUILDING
    // ========================================

    getBuildingAt(
        mapX,
        mapY
    ) {

        for (
            const building
            of buildings
        ) {

            if (
                mapX >= building.x &&
                mapX < building.x +
                    building.width &&
                mapY >= building.y &&
                mapY < building.y +
                    building.depth
            ) {

                return building;
            }
        }


        return null;
    }


    // ========================================
    // RENDER ENTITIES
    // ========================================

    renderEntities(
        entities,
        player
    ) {

        const allEntities = [

            ...entities.trees,

            ...entities.cars,

            ...entities.pedestrians
        ];


        // Far → near.

        allEntities.sort(
            (a, b) =>
                b.distanceTo(player) -
                a.distanceTo(player)
        );


        for (
            const entity
            of allEntities
        ) {

            this.renderEntity(
                entity,
                player
            );
        }
    }


    // ========================================
    // ENTITY PROJECTION
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
            distance < 0.1 ||
            distance > 28
        ) {

            return;
        }


        let relativeAngle =
            Math.atan2(
                dy,
                dx
            ) -
            player.angle;


        while (
            relativeAngle >
            Math.PI
        ) {

            relativeAngle -=
                Math.PI * 2;
        }


        while (
            relativeAngle <
            -Math.PI
        ) {

            relativeAngle +=
                Math.PI * 2;
        }


        const FOV =
            Math.PI / 3;


        if (
            Math.abs(
                relativeAngle
            ) >
            FOV / 2 +
            0.15
        ) {

            return;
        }


        const screenX =
            (
                relativeAngle /
                FOV +
                0.5
            ) *
            this.columns;


        const correctedDistance =
            distance *
            Math.cos(
                relativeAngle
            );


        if (
            correctedDistance <= 0
        ) {

            return;
        }


        const projectedHeight =
            (
                entity.height /
                correctedDistance
            ) *
            this.rows *
            0.65;


        const projectedWidth =
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
                projectedHeight / 2
            );


        const bottom =
            Math.floor(
                centerY +
                projectedHeight / 2
            );


        const left =
            Math.floor(
                screenX -
                projectedWidth / 2
            );


        const right =
            Math.ceil(
                screenX +
                projectedWidth / 2
            );


        const brightness =
            calculateBrightness(
                correctedDistance,
                28
            );


        const color =
            brightnessToColor(
                brightness
            );


        const sprite =
            this.getSprite(
                entity.type
            );


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
                sx < sprite[sy].length;
                sx++
            ) {

                const char =
                    sprite[sy][sx];


                if (
                    char === " "
                ) {

                    continue;
                }


                const screenCellX =
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


                const screenCellY =
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
                    screenCellX,
                    screenCellY,
                    char,
                    color,
                    correctedDistance
                );
            }
        }
    }


    // ========================================
    // SPRITES
    // ========================================

    getSprite(type) {

        switch (type) {

            case "tree":

                return [

                    "  /\\  ",
                    " /@@\\ ",
                    "/@@@@\\",
                    " /@@\\ ",
                    "  ||  ",
                    "  ||  "
                ];


            case "car":

                return [

                    "  ____  ",
                    " /____\\ ",
                    "|[][][]|",
                    " O    O "
                ];


            case "pedestrian":

                return [

                    " O ",
                    "/|\\",
                    "/ \\"
                ];


            default:

                return ["?"];
        }
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


                const character =
                    this.characters[index];


                if (
                    character === " "
                ) {

                    continue;
                }


                this.ctx.fillStyle =
                    this.colors[index];


                this.ctx.fillText(
                    character,
                    x *
                        this.cellWidth +
                        this.cellWidth / 2,

                    y *
                        this.cellHeight +
                        this.cellHeight / 2
                );
            }
        }
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
            raycaster
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
                    tile === "#"
                ) {

                    ctx.fillStyle =
                        "#777";

                } else {

                    ctx.fillStyle =
                        "#111";
                }


                ctx.fillRect(
                    x * scaleX,
                    y * scaleY,
                    scaleX + 1,
                    scaleY + 1
                );
            }
        }


        // Player

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
            ) * 12,

            py +
            Math.sin(
                player.angle
            ) * 12
        );


        ctx.stroke();
    }
}