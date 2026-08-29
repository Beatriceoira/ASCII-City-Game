// ============================================
// ENTITIES.JS
// ============================================

import {
    isWall,
    spawnPoints
} from "./world.js";


// ============================================
// TREES
// ============================================

export class Tree {

    constructor(x, y) {

        this.x = x;

        this.y = y;

        this.type = "tree";
    }
}


// ============================================
// CAR
// ============================================

export class Car {

    constructor(
        x,
        y,
        angle,
        speed
    ) {

        this.x = x;

        this.y = y;

        this.angle = angle;

        this.speed = speed;

        this.type = "car";
    }


    update(deltaTime) {

        const dx =
            Math.cos(this.angle) *
            this.speed *
            deltaTime;

        const dy =
            Math.sin(this.angle) *
            this.speed *
            deltaTime;


        const nextX =
            this.x + dx;

        const nextY =
            this.y + dy;


        if (
            !isWall(nextX, nextY)
        ) {

            this.x = nextX;

            this.y = nextY;

        } else {

            // Turn around

            this.angle += Math.PI;
        }
    }
}


// ============================================
// PEDESTRIAN
// ============================================

export class Pedestrian {

    constructor(
        x,
        y,
        angle,
        speed
    ) {

        this.x = x;

        this.y = y;

        this.angle = angle;

        this.speed = speed;

        this.type = "pedestrian";

        this.changeDirectionTimer =
            Math.random() * 3;
    }


    update(deltaTime) {

        this.changeDirectionTimer -=
            deltaTime;


        if (
            this.changeDirectionTimer <= 0
        ) {

            this.angle +=
                (Math.random() - 0.5) *
                Math.PI;


            this.changeDirectionTimer =
                2 +
                Math.random() * 4;
        }


        const dx =
            Math.cos(this.angle) *
            this.speed *
            deltaTime;

        const dy =
            Math.sin(this.angle) *
            this.speed *
            deltaTime;


        const nextX =
            this.x + dx;

        const nextY =
            this.y + dy;


        if (
            !isWall(nextX, nextY)
        ) {

            this.x = nextX;

            this.y = nextY;

        } else {

            this.angle +=
                Math.PI / 2;
        }
    }
}


// ============================================
// CREATE ENTITIES
// ============================================

export function createEntities() {

    const trees =
        spawnPoints.trees.map(
            point =>
                new Tree(
                    point.x,
                    point.y
                )
        );


    const cars =
        spawnPoints.cars.map(
            point =>
                new Car(
                    point.x,
                    point.y,
                    point.angle,
                    point.speed
                )
        );


    const pedestrians =
        spawnPoints.pedestrians.map(
            point =>
                new Pedestrian(
                    point.x,
                    point.y,
                    point.angle,
                    point.speed
                )
        );


    return {
        trees,
        cars,
        pedestrians
    };
}


// ============================================
// UPDATE ENTITIES
// ============================================

export function updateEntities(
    entities,
    deltaTime
) {

    for (const car of entities.cars) {

        car.update(deltaTime);
    }


    for (
        const pedestrian
        of entities.pedestrians
    ) {

        pedestrian.update(deltaTime);
    }
}