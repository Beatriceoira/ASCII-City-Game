// ============================================
// RAYCASTER.JS — VERSION 5
// ============================================

import {
    getTile,
    TILE
} from "./world.js";


export class Raycaster {

    constructor() {

        this.maxDepth = 50;
    }


    castRay(
        originX,
        originY,
        angle
    ) {

        const rayDirX =
            Math.cos(angle);


        const rayDirY =
            Math.sin(angle);


        let mapX =
            Math.floor(originX);


        let mapY =
            Math.floor(originY);


        const deltaDistX =
            rayDirX === 0
                ? Infinity
                : Math.abs(
                    1 / rayDirX
                );


        const deltaDistY =
            rayDirY === 0
                ? Infinity
                : Math.abs(
                    1 / rayDirY
                );


        let stepX;

        let stepY;

        let sideDistX;

        let sideDistY;


        if (
            rayDirX < 0
        ) {

            stepX = -1;

            sideDistX =
                (
                    originX -
                    mapX
                ) *
                deltaDistX;

        } else {

            stepX = 1;

            sideDistX =
                (
                    mapX + 1 -
                    originX
                ) *
                deltaDistX;
        }


        if (
            rayDirY < 0
        ) {

            stepY = -1;

            sideDistY =
                (
                    originY -
                    mapY
                ) *
                deltaDistY;

        } else {

            stepY = 1;

            sideDistY =
                (
                    mapY + 1 -
                    originY
                ) *
                deltaDistY;
        }


        let side = 0;


        for (
            let i = 0;
            i < 256;
            i++
        ) {

            if (
                sideDistX <
                sideDistY
            ) {

                sideDistX +=
                    deltaDistX;

                mapX +=
                    stepX;

                side = 0;

            } else {

                sideDistY +=
                    deltaDistY;

                mapY +=
                    stepY;

                side = 1;
            }


            const tile =
                getTile(
                    mapX,
                    mapY
                );


            if (
                tile ===
                TILE.BUILDING
            ) {

                let distance;


                if (
                    side === 0
                ) {

                    distance =
                        (
                            mapX -
                            originX +
                            (
                                1 -
                                stepX
                            ) / 2
                        ) /
                        rayDirX;

                } else {

                    distance =
                        (
                            mapY -
                            originY +
                            (
                                1 -
                                stepY
                            ) / 2
                        ) /
                        rayDirY;
                }


                distance =
                    Math.abs(
                        distance
                    );


                return {

                    hit: true,

                    distance,

                    side,

                    mapX,

                    mapY,

                    hitX:
                        originX +
                        rayDirX *
                        distance,

                    hitY:
                        originY +
                        rayDirY *
                        distance
                };
            }


            if (
                i >= 255
            ) {

                break;
            }
        }


        return {

            hit: false,

            distance:
                this.maxDepth

        };
    }
}