// ============================================
// SIMULATION.JS — VERSION 5
// Traffic, pedestrians, signals and population
// ============================================

import {
    roadTiles, sidewalkTiles, destinations, trafficLights,
    getTile, TILE, getTrafficLightAt
} from "./world.js";
import { findPath } from "./pathfinding.js";

function randomFrom(list) {
    return list.length ? list[Math.floor(Math.random()*list.length)] : null;
}

export class CitySimulation {
    constructor(entities) {
        this.entities=entities;
        this.time=8*60;
        this.daySpeed=0.35;
        this.spawnTimer=0;
        this.pedSpawnTimer=0;
        this.population=25000;
        this.activeResidents=0;
        this.activeWorkers=0;
        this.activeStudents=0;
        this.activity=0.55;
    }

    update(dt) {
        this.time += dt*this.daySpeed;
        if (this.time>=1440) this.time-=1440;
        this.updatePopulation();

        for (const light of this.entities.traffic) this.updateSignal(light,dt);

        for (const car of this.entities.cars) car.aiUpdate(dt,this.entities,this);
        for (const ped of this.entities.pedestrians) ped.aiUpdate(dt,this.entities,this);

        this.spawnTimer += dt;
        this.pedSpawnTimer += dt;

        const trafficRate = this.getTrafficRate();
        if (this.spawnTimer >= Math.max(0.45,2.2-trafficRate*1.5)) {
            this.spawnVehicle();
            this.spawnTimer=0;
        }
        if (this.pedSpawnTimer >= Math.max(0.8,3.0-this.activity*1.8)) {
            this.spawnPedestrian();
            this.pedSpawnTimer=0;
        }

        this.cleanup();
    }

    updatePopulation() {
        const h=this.time/60;
        if (h>=7 && h<9) this.activity=0.95;
        else if (h>=9 && h<16) this.activity=0.65;
        else if (h>=16 && h<19) this.activity=1.0;
        else if (h>=19 && h<22) this.activity=0.55;
        else this.activity=0.18;

        this.activeWorkers=Math.floor(this.population*0.34*(h>=7&&h<19?1:0.08));
        this.activeStudents=Math.floor(this.population*0.16*(h>=7&&h<17?1:0.05));
        this.activeResidents=Math.max(0,this.population-this.activeWorkers-this.activeStudents);
    }

    updateSignal(light,dt) {
        light.timer += dt;
        const greenDuration=8, yellowDuration=2;
        if (light.state==="green" && light.timer>=greenDuration) {
            light.state="yellow"; light.timer=0;
        } else if (light.state==="yellow" && light.timer>=yellowDuration) {
            light.state="red"; light.timer=0;
        } else if (light.state==="red" && light.timer>=2) {
            light.state="green";
            light.greenAxis=light.greenAxis==="horizontal"?"vertical":"horizontal";
            light.timer=0;
        }
    }

    getTrafficRate() {
        const h=this.time/60;
        if ((h>=7&&h<9)||(h>=16&&h<19)) return 1.0;
        if (h>=22||h<6) return 0.2;
        return 0.6;
    }

    spawnVehicle() {
        if (!roadTiles.length || this.entities.cars.length>=70) return;
        const p=randomFrom(roadTiles), target=randomFrom(roadTiles);
        if (!p||!target) return;
        const horizontal=Math.abs(p.y-Math.round(p.y))<0.51 && Math.abs(p.x-Math.round(p.x))>0.5;
        const angle=horizontal?(Math.random()<0.5?0:Math.PI):(Math.random()<0.5?Math.PI/2:-Math.PI/2);
        const {Car}=this.entities.classes;
        const car=new Car(p.x,p.y,angle,1.5+Math.random()*1.4);
        car.route=findPath(p.x,p.y,target.x,target.y,"car");
        car.spawned=true;
        this.entities.cars.push(car);
    }

    spawnPedestrian() {
        if (!sidewalkTiles.length || this.entities.pedestrians.length>=100) return;
        const p=randomFrom(sidewalkTiles);
        const destination=randomFrom(destinations);
        if (!p||!destination) return;
        const {Pedestrian}=this.entities.classes;
        const ped=new Pedestrian(p.x,p.y,Math.random()*Math.PI*2,0.7+Math.random()*0.5);
        ped.destination=destination;
        ped.route=findPath(p.x,p.y,destination.x,destination.y,"pedestrian");
        ped.spawned=true;
        this.entities.pedestrians.push(ped);
    }

    cleanup() {
        this.entities.cars=this.entities.cars.filter(c =>
            !c.dead && (c.x>=0&&c.x<80&&c.y>=0&&c.y<80)
        );
        this.entities.pedestrians=this.entities.pedestrians.filter(p =>
            !p.dead && (p.x>=0&&p.x<80&&p.y>=0&&p.y<80)
        );
    }

    getClockString() {
        const h=Math.floor(this.time/60)%24, m=Math.floor(this.time%60);
        return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    }
}
