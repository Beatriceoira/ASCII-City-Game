// ============================================
// RAYCASTER.JS
// ============================================

import {
    WORLD_MAP,
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./world.js";


export class Raycaster {

    constructor() {

        this.maxDepth = 30;
    }


    // ========================================
    // CAST RAY
    // ========================================

    castRay(
        startX,
        startY,
        angle
    ) {

        const rayDirX =
            Math.cos(angle);

        const rayDirY =
            Math.sin(angle);


        let mapX =
            Math.floor(startX);

        let mapY =
            Math.floor(startY);


        const deltaDistX =
            Math.abs(
                1 / rayDirX
            );

        const deltaDistY =
            Math.abs(
                1 / rayDirY
            );


        let stepX;
        let stepY;

        let sideDistX;
        let sideDistY;


        if (rayDirX < 0) {

            stepX = -1;

            sideDistX =
                (startX - mapX) *
                deltaDistX;

        } else {

            stepX = 1;

            sideDistX =
                (mapX + 1 - startX) *
                deltaDistX;
        }


        if (rayDirY < 0) {

            stepY = -1;

            sideDistY =
                (startY - mapY) *
                deltaDistY;

        } else {

            stepY = 1;

            sideDistY =
                (mapY + 1 - startY) *
                deltaDistY;
        }


        let hit = false;

        let side = 0;

        let distance = 0;


        while (
            !hit &&
            distance < this.maxDepth
        ) {

            if (
                sideDistX <
                sideDistY
            ) {

                sideDistX +=
                    deltaDistX;

                mapX += stepX;

                side = 0;

            } else {

                sideDistY +=
                    deltaDistY;

                mapY += stepY;

                side = 1;
            }


            if (
                mapX < 0 ||
                mapX >= WORLD_WIDTH ||
                mapY < 0 ||
                mapY >= WORLD_HEIGHT
            ) {

                break;
            }


            if (
                WORLD_MAP[mapY][mapX] === "#"
            ) {

                hit = true;
            }
        }


        if (!hit) {

            return {
                hit: false,
                distance: this.maxDepth
            };
        }


        if (side === 0) {

            distance =
                sideDistX -
                deltaDistX;

        } else {

            distance =
                sideDistY -
                deltaDistY;
        }


        return {

            hit: true,

            distance:

                Math.max(
                    0.001,
                    distance
                ),

            side,

            mapX,
            mapY
        };
    }
}