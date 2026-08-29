// ============================================
// RENDERER.JS
// ============================================

import {
    brightnessToASCII,
    calculateWallBrightness
} from "./lighting.js";


export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");


        this.width = 0;

        this.height = 0;

        this.cellWidth = 9;

        this.cellHeight = 14;


        this.columns = 100;

        this.rows = 45;


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


        this.width =
            this.canvas.width;

        this.height =
            this.canvas.height;


        const estimatedColumns =
            Math.floor(
                this.width /
                this.cellWidth
            );


        const estimatedRows =
            Math.floor(
                this.height /
                this.cellHeight
            );


        this.columns =
            Math.max(
                60,
                Math.min(
                    160,
                    estimatedColumns
                )
            );


        this.rows =
            Math.max(
                30,
                Math.min(
                    70,
                    estimatedRows
                )
            );


        this.cellWidth =
            this.width /
            this.columns;

        this.cellHeight =
            this.height /
            this.rows;
    }


    // ========================================
    // CLEAR
    // ========================================

    clear() {

        this.ctx.fillStyle =
            "#050505";

        this.ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }


    // ========================================
    // RENDER
    // ========================================

    render(
        player,
        raycaster
    ) {

        this.clear();


        const ctx =
            this.ctx;


        ctx.font =
            `${Math.floor(
                this.cellHeight
            )}px monospace`;

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";


        const FOV =
            Math.PI / 3;


        for (
            let column = 0;
            column < this.columns;
            column++
        ) {

            const cameraX =
                column /
                this.columns;


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


            if (!ray.hit) {
                continue;
            }


            const distance =
                ray.distance;


            // Prevent fish-eye distortion.

            const correctedDistance =
                distance *
                Math.cos(
                    rayAngle -
                    player.angle
                );


            const wallHeight =
                1 /
                Math.max(
                    correctedDistance,
                    0.001
                );


            const projectedHeight =
                wallHeight *
                this.rows *
                0.9;


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


            const brightness =
                calculateWallBrightness(
                    correctedDistance,
                    ray.side,
                    raycaster.maxDepth
                );


            const character =
                brightnessToASCII(
                    brightness
                );


            // Draw wall vertically.

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


                const x =
                    column *
                    this.cellWidth +
                    this.cellWidth / 2;


                const y =
                    row *
                    this.cellHeight +
                    this.cellHeight / 2;


                // Slightly warm grayscale.

                const value =
                    Math.floor(
                        30 +
                        brightness * 225
                    );


                ctx.fillStyle =
                    `rgb(${value},${value},${value})`;


                ctx.fillText(
                    character,
                    x,
                    y
                );
            }
        }


        this.renderGround();
    }


    // ========================================
    // GROUND
    // ========================================

    renderGround() {

        const ctx =
            this.ctx;


        ctx.font =
            `${Math.floor(
                this.cellHeight
            )}px monospace`;


        ctx.textAlign = "center";

        ctx.textBaseline = "middle";


        const horizon =
            this.height / 2;


        for (
            let row = Math.floor(
                this.rows / 2
            );
            row < this.rows;
            row++
        ) {

            const normalized =
                (row -
                this.rows / 2) /
                (this.rows / 2);


            let character = ".";


            if (
                normalized > 0.5
            ) {

                character = ",";
            }


            if (
                normalized > 0.8
            ) {

                character = ":";
            }


            const brightness =
                Math.max(
                    0.05,
                    0.2 -
                    normalized * 0.12
                );


            const value =
                Math.floor(
                    brightness * 255
                );


            ctx.fillStyle =
                `rgb(${value},${value},${value})`;


            for (
                let column = 0;
                column < this.columns;
                column++
            ) {

                const x =
                    column *
                    this.cellWidth +
                    this.cellWidth / 2;


                const y =
                    row *
                    this.cellHeight +
                    this.cellHeight / 2;


                ctx.fillText(
                    character,
                    x,
                    y
                );
            }
        }
    }


    // ========================================
    // DRAW ENTITY
    // ========================================

    drawEntity(
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
            distance <= 0.1 ||
            distance > 25
        ) {
            return;
        }


        let angle =
            Math.atan2(
                dy,
                dx
            ) -
            player.angle;


        // Normalize angle.

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
            FOV / 2
        ) {
            return;
        }


        const screenX =
            (
                angle /
                (FOV / 2)
            ) *
            (this.width / 2) +
            this.width / 2;


        const brightness =
            Math.max(
                0.1,
                1 -
                distance / 25
            );


        const value =
            Math.floor(
                brightness * 255
            );


        let character;


        switch (entity.type) {

            case "tree":
                character = "♣";
                break;

            case "car":
                character = "▣";
                break;

            case "pedestrian":
                character = "♟";
                break;

            default:
                character = "?";
        }


        const size =
            Math.max(
                10,
                40 / distance
            );


        this.ctx.font =
            `${size}px monospace`;


        this.ctx.fillStyle =
            `rgb(${value},${value},${value})`;


        this.ctx.fillText(
            character,
            screenX,
            this.height / 2
        );
    }
}