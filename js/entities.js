// ============================================
// ENTITIES.JS — VERSION 5
// ============================================

import {
    isWall, roadTiles, destinations, getTrafficLightAt, getTile, TILE,
    treeSpawns, carSpawns, pedestrianSpawns, streetLights, trafficLights
} from "./world.js";
import { findPath } from "./pathfinding.js";

class Entity {
    constructor(x,y){this.x=x;this.y=y;this.height=1;this.width=.5;this.type="entity";this.dead=false;}
    distanceTo(player){return Math.hypot(this.x-player.x,this.y-player.y);}
}

export class Tree extends Entity {
    constructor(x,y){super(x,y);this.type="tree";this.height=2.7;this.width=.75;}
}

export class StreetLight extends Entity {
    constructor(x,y){super(x,y);this.type="streetLight";this.height=3;this.width=.25;this.radius=5;}
}

export class TrafficLight extends Entity {
    constructor(x,y,state="red",greenAxis="horizontal"){
        super(x,y);this.type="trafficLight";this.state=state;this.greenAxis=greenAxis;
        this.timer=0;this.height=2.5;this.width=.3;
    }
}

export class Car extends Entity {
    constructor(x,y,angle=0,speed=2){
        super(x,y);this.type="car";this.angle=angle;this.speed=speed;
        this.targetSpeed=speed;this.maxSpeed=4.5;this.acceleration=2.4;
        this.height=.65;this.width=1.1;this.route=[];this.routeIndex=0;
        this.state="DRIVING";this.age=0;this.spawned=false;
    }

    aiUpdate(dt,entities) {
        this.age+=dt;
        if(!this.route.length||this.routeIndex>=this.route.length) {
            const target=roadTiles[Math.floor(Math.random()*roadTiles.length)];
            if(target){this.route=findPath(this.x,this.y,target.x,target.y,"car");this.routeIndex=0;}
        }

        const waypoint=this.route[this.routeIndex];
        if(waypoint) {
            if(Math.hypot(waypoint.x-this.x,waypoint.y-this.y)<.3)this.routeIndex++;
            const next=this.route[Math.min(this.routeIndex,this.route.length-1)];
            if(next)this.angle=this.turnToward(next.x,next.y,dt);
        }

        let desired=this.maxSpeed;
        const light=this.findRelevantLight();
        if(light && light.state==="red") {desired=0;this.state="RED_LIGHT";}
        else if(light && light.state==="yellow") {desired=1.0;this.state="YELLOW_LIGHT";}
        else if(this.isBlockedByCar(entities.cars)) {desired=0;this.state="FOLLOWING";}
        else if(this.isBlockedByPedestrian(entities.pedestrians)) {desired=0;this.state="YIELDING";}
        else this.state="DRIVING";

        this.targetSpeed=desired;
        if(this.speed<desired)this.speed=Math.min(desired,this.speed+this.acceleration*dt);
        else this.speed=Math.max(desired,this.speed-this.acceleration*1.8*dt);

        const nx=this.x+Math.cos(this.angle)*this.speed*dt;
        const ny=this.y+Math.sin(this.angle)*this.speed*dt;
        if(!isWall(nx,ny)){this.x=nx;this.y=ny;} else {this.route=[];this.speed=0;}

        if((this.x<0||this.x>80||this.y<0||this.y>80)&&this.age>2)this.dead=true;
        if(this.age>75 && Math.random()<dt*.01)this.dead=true;
    }

    findRelevantLight() {
        const light=getTrafficLightAt(this.x,this.y);
        if(!light)return null;
        const d=Math.hypot(light.x-this.x,light.y-this.y);
        if(d>2.0)return null;
        return light;
    }

    turnToward(x,y,dt) {
        const target=Math.atan2(y-this.y,x-this.x);
        let diff=target-this.angle;
        while(diff>Math.PI)diff-=Math.PI*2;
        while(diff<-Math.PI)diff+=Math.PI*2;
        const step=3.4*dt;
        return Math.abs(diff)<=step?target:this.angle+Math.sign(diff)*step;
    }

    isBlockedByCar(cars) {
        const fx=Math.cos(this.angle),fy=Math.sin(this.angle);
        return cars.some(other=>{
            if(other===this)return false;
            const dx=other.x-this.x,dy=other.y-this.y,d=Math.hypot(dx,dy);
            return d<1.8&&d>.05&&(dx*fx+dy*fy)>.72*d;
        });
    }

    isBlockedByPedestrian(peds) {
        return peds.some(p=>{
            const d=Math.hypot(p.x-this.x,p.y-this.y);
            return d<1.35&&getTile(p.x,p.y)!==TILE.BUILDING&&p.state==="CROSSING";
        });
    }
}

export class Pedestrian extends Entity {
    constructor(x,y,angle=0,speed=1){
        super(x,y);this.type="pedestrian";this.angle=angle;this.speed=speed;
        this.height=1.7;this.width=.35;this.route=[];this.routeIndex=0;
        this.state="WALKING";this.destination=null;this.waitTimer=0;this.age=0;
    }

    aiUpdate(dt,entities) {
        this.age+=dt;
        if(this.state==="IDLE") {
            this.waitTimer-=dt;
            if(this.waitTimer<=0)this.chooseDestination();
            return;
        }
        if(!this.destination||!this.route.length||this.routeIndex>=this.route.length)this.chooseDestination();

        const waypoint=this.route[this.routeIndex];
        if(!waypoint)return;

        if(Math.hypot(waypoint.x-this.x,waypoint.y-this.y)<.3) {
            this.routeIndex++;
            if(this.routeIndex>=this.route.length){this.state="IDLE";this.waitTimer=1+Math.random()*4;return;}
        }

        const next=this.route[this.routeIndex];
        if(!next)return;

        const nextTile=getTile(next.x,next.y);
        const crossing=nextTile===TILE.ROAD;
        if(crossing&&!this.safeToCross()) {this.state="WAITING";return;}
        this.state=crossing?"CROSSING":"WALKING";

        this.angle=this.turnToward(next.x,next.y,dt);
        const nx=this.x+Math.cos(this.angle)*this.speed*dt;
        const ny=this.y+Math.sin(this.angle)*this.speed*dt;
        if(!isWall(nx,ny)){this.x=nx;this.y=ny;}else this.route=[];
    }

    chooseDestination() {
        this.destination=destinations[Math.floor(Math.random()*destinations.length)]||null;
        if(this.destination){
            this.route=findPath(this.x,this.y,this.destination.x,this.destination.y,"pedestrian");
            this.routeIndex=0;this.state="WALKING";
        }
    }

    safeToCross() {
        const light=getTrafficLightAt(this.x,this.y);
        if(!light)return true;
        // Pedestrians receive the opposing phase. A red vehicle phase is safe.
        return light.state==="red";
    }

    turnToward(x,y,dt) {
        const target=Math.atan2(y-this.y,x-this.x);
        let diff=target-this.angle;
        while(diff>Math.PI)diff-=Math.PI*2;
        while(diff<-Math.PI)diff+=Math.PI*2;
        const step=2.8*dt;
        return Math.abs(diff)<=step?target:this.angle+Math.sign(diff)*step;
    }
}

export function createEntities() {
    return {
        trees:treeSpawns.map(p=>new Tree(p.x,p.y)),
        cars:carSpawns.map(p=>new Car(p.x,p.y,p.angle,p.speed)),
        pedestrians:pedestrianSpawns.map(p=>new Pedestrian(p.x,p.y,p.angle,p.speed)),
        lights:streetLights.map(p=>new StreetLight(p.x,p.y)),
        traffic:trafficLights.map(p=>new TrafficLight(p.x,p.y,p.state,p.greenAxis)),
        classes:{Car,Pedestrian}
    };
}

export function updateEntities(entities,dt) {}
