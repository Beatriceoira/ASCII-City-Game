// ============================================
// ENTITIES.JS
// ============================================

import {
    isWall,
    treeSpawns,
    carSpawns,
    pedestrianSpawns
} from "./world.js";


// ============================================
// BASE ENTITY
// ============================================

class Entity {

    constructor(
        x,
        y
    ) {

        this.x = x;

        this.y = y;

        this.height = 1;

        this.width = 0.5;

        this.type = "entity";

        this.character = "?";
    }


    distanceTo(player) {

        const dx =
            this.x -
            player.x;

        const dy =
            this.y -
            player.y;


        return Math.sqrt(
            dx * dx +
            dy * dy
        );
    }
}


// ============================================
// TREE
// ============================================

export class Tree
    extends Entity {

    constructor(
        x,
        y
    ) {

        super(x, y);

        this.type = "tree";

        this.height = 2.8;

        this.width = 0.7;
    }
}


// ============================================
// CAR
// ============================================

export class Car
    extends Entity {

    constructor(
        x,
        y,
        angle,
        speed
    ) {

        super(x, y);

        this.type = "car";

        this.angle = angle;

        this.speed = speed;

        this.height = 0.65;

        this.width = 1.0;
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
            !isWall(
                nextX,
                nextY
            )
        ) {

            this.x = nextX;

            this.y = nextY;

        } else {

            this.angle +=
                Math.PI;
        }
    }
}


// ============================================
// PEDESTRIAN
// ============================================

export class Pedestrian
    extends Entity {

    constructor(
        x,
        y,
        angle,
        speed
    ) {

        super(x, y);

        this.type =
            "pedestrian";

        this.angle =
            angle;

        this.speed =
            speed;

        this.height =
            1.7;

        this.width =
            0.25;

        this.timer =
            Math.random() * 3;
    }


    update(deltaTime) {

        this.timer -=
            deltaTime;


        if (
            this.timer <= 0
        ) {

            this.angle +=
                (
                    Math.random() -
                    0.5
                ) *
                Math.PI;


            this.timer =
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
            !isWall(
                nextX,
                nextY
            )
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
        treeSpawns.map(
            point =>
                new Tree(
                    point.x,
                    point.y
                )
        );


    const cars =
        carSpawns.map(
            point =>
                new Car(
                    point.x,
                    point.y,
                    point.angle,
                    point.speed
                )
        );


    const pedestrians =
        pedestrianSpawns.map(
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
// UPDATE
// ============================================

export function updateEntities(
    entities,
    deltaTime
) {

    for (
        const car
        of entities.cars
    ) {

        car.update(
            deltaTime
        );
    }


    for (
        const pedestrian
        of entities.pedestrians
    ) {

        pedestrian.update(
            deltaTime
        );
    }
}