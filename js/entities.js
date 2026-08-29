// ============================================
// ENTITIES.JS
// ============================================

import {
    isWall,
    treeSpawns,
    carSpawns,
    pedestrianSpawns,
    streetLights,
    trafficLights
} from "./world.js";


// ============================================
// BASE
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

        this.width = 1;
    }


    update(
        deltaTime
    ) {

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

        this.timer =
            Math.random() * 3;
    }


    update(
        deltaTime
    ) {

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
// STREET LIGHT
// ============================================

export class StreetLight
    extends Entity {

    constructor(
        x,
        y
    ) {

        super(x, y);

        this.type =
            "streetLight";

        this.height =
            3.0;

        this.width =
            0.25;

        this.radius =
            4.5;
    }
}


// ============================================
// TRAFFIC LIGHT
// ============================================

export class TrafficLight
    extends Entity {

    constructor(
        x,
        y,
        state
    ) {

        super(x, y);

        this.type =
            "trafficLight";

        this.state =
            state;

        this.height =
            2.5;

        this.width =
            0.3;
    }
}


// ============================================
// CREATE
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


    const lights =
        streetLights.map(
            point =>
                new StreetLight(
                    point.x,
                    point.y
                )
        );


    const traffic =
        trafficLights.map(
            point =>
                new TrafficLight(
                    point.x,
                    point.y,
                    point.state
                )
        );


    return {

        trees,

        cars,

        pedestrians,

        lights,

        traffic

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