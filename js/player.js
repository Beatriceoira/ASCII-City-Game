// ========================================
// ASCII CITY — PLAYER.JS
// VERSION 5
// ========================================

import { isWall } from "./world.js";

export class Player {
    constructor(x=10.5,y=5.5,angle=0) {
        this.x=x; this.y=y; this.angle=angle;
        this.moveSpeed=4.0;
        this.sprintMultiplier=1.8;
        this.rotationSpeed=2.5;
        this.radius=0.22;
        this.height=0.5;
        this.pitch=0;
        this.world=null;
    }

    update(deltaTime,input) {
        if (!input || typeof input.isDown!=="function") return;
        deltaTime=Math.min(deltaTime,0.1);

        if (typeof input.getMouseDeltaX==="function") {
            this.angle += input.getMouseDeltaX()*0.0025;
        }

        let rotation=0;
        if(input.isDown("KeyA")||input.isDown("ArrowLeft")) rotation-=this.rotationSpeed*deltaTime;
        if(input.isDown("KeyD")||input.isDown("ArrowRight")) rotation+=this.rotationSpeed*deltaTime;
        this.angle += rotation;
        this.angle %= Math.PI*2;
        if(this.angle<0)this.angle+=Math.PI*2;

        let forward=0,strafe=0;
        if(input.isDown("KeyW")||input.isDown("ArrowUp"))forward++;
        if(input.isDown("KeyS")||input.isDown("ArrowDown"))forward--;
        if(input.isDown("KeyQ"))strafe--;
        if(input.isDown("KeyE"))strafe++;

        if(!forward&&!strafe)return;

        let speed=this.moveSpeed;
        if(input.isDown("ShiftLeft")||input.isDown("ShiftRight"))speed*=this.sprintMultiplier;

        const fx=Math.cos(this.angle),fy=Math.sin(this.angle);
        const rx=-Math.sin(this.angle),ry=Math.cos(this.angle);
        let dx=fx*forward+rx*strafe;
        let dy=fy*forward+ry*strafe;
        const len=Math.hypot(dx,dy);
        if(!len)return;
        dx=dx/len*speed*deltaTime;
        dy=dy/len*speed*deltaTime;
        this.move(dx,dy);
    }

    move(dx,dy) {
        const nx=this.x+dx,ny=this.y+dy;
        if(!this.collides(nx,this.y))this.x=nx;
        if(!this.collides(this.x,ny))this.y=ny;
    }

    collides(x,y) {
        const r=this.radius;
        return isWall(x-r,y-r)||isWall(x+r,y-r)||isWall(x-r,y+r)||isWall(x+r,y+r);
    }

    setWorld(world){this.world=world;}

    reset(x=10.5,y=5.5,angle=0) {
        this.x=x;this.y=y;this.angle=angle;this.pitch=0;
    }

    getPosition(){return {x:this.x,y:this.y,angle:this.angle};}
    getDirection(){return {x:Math.cos(this.angle),y:Math.sin(this.angle)};}
    getForwardVector(){return this.getDirection();}
    getRightVector(){return {x:-Math.sin(this.angle),y:Math.cos(this.angle)};}
}
