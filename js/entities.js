// ============================================
// ENTITIES.JS — VERSION 4
// ============================================

import {
    isWall,
    treeSpawns,
    carSpawns,
    pedestrianSpawns,
    streetLights,
    trafficLights
} from "./world.js";


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


    distanceTo(
        player
    ) {

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

        super(
            x,
            y
        );

        this.type =
            "tree";

        this.height =
            2.7;

        this.width =
            0.75;
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

        super(
            x,
            y
        );

        this.type =
            "car";

        this.angle =
            angle;

        this.speed =
            speed;

        this.height =
            0.65;

        this.width =
            1.1;
    }


    update(
        deltaTime
    ) {

        const dx =
            Math.cos(
                this.angle
            ) *
            this.speed *
            deltaTime;


        const dy =
            Math.sin(
                this.angle
            ) *
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

            this.x =
                nextX;

            this.y =
                nextY;

        } else {

            this.angle +=
                Math.PI;
        }


        // Wrap around city.

        if (
            this.x < 1
        ) {

            this.x = 78;
        }


        if (
            this.x > 79
        ) {

            this.x = 1;
        }


        if (
            this.y < 1
        ) {

            this.y = 78;
        }


        if (
            this.y > 79
        ) {

            this.y = 1;
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

        super(
            x,
            y
        );

        this.type =
            "pedestrian";

        this.angle =
            angle;

        this.speed =
            speed;

        this.timer =
            Math.random() * 4;

        this.height =
            1.7;

        this.width =
            0.35;
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
            Math.cos(
                this.angle
            ) *
            this.speed *
            deltaTime;


        const dy =
            Math.sin(
                this.angle
            ) *
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

            this.x =
                nextX;

            this.y =
                nextY;

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

        super(
            x,
            y
        );

        this.type =
            "streetLight";

        this.height =
            3;

        this.width =
            0.25;

        this.radius =
            5;
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

        super(
            x,
            y
        );

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

    return {

        trees:
            treeSpawns.map(
                p =>
                    new Tree(
                        p.x,
                        p.y
                    )
            ),

        cars:
            carSpawns.map(
                p =>
                    new Car(
                        p.x,
                        p.y,
                        p.angle,
                        p.speed
                    )
            ),

        pedestrians:
            pedestrianSpawns.map(
                p =>
                    new Pedestrian(
                        p.x,
                        p.y,
                        p.angle,
                        p.speed
                    )
            ),

        lights:
            streetLights.map(
                p =>
                    new StreetLight(
                        p.x,
                        p.y
                    )
            ),

        traffic:
            trafficLights.map(
                p =>
                    new TrafficLight(
                        p.x,
                        p.y,
                        p.state
                    )
            )

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