// ============================================
// PATHFINDING.JS — VERSION 5
// Grid A* for cars and pedestrians
// ============================================

import { WORLD_WIDTH, WORLD_HEIGHT, TILE, getTile } from "./world.js";

function key(x,y) { return `${x},${y}`; }
function heuristic(a,b) { return Math.abs(a.x-b.x) + Math.abs(a.y-b.y); }

function neighbors(node, mode) {
    const result = [];
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [dx,dy] of dirs) {
        const x=node.x+dx, y=node.y+dy;
        if (x<0 || y<0 || x>=WORLD_WIDTH || y>=WORLD_HEIGHT) continue;
        const tile=getTile(x,y);

        if (mode==="car") {
            if (tile!==TILE.ROAD && tile!==TILE.CROSSWALK) continue;
        } else {
            if (tile===TILE.BUILDING) continue;
        }
        result.push({x,y});
    }
    return result;
}

export function findPath(startX,startY,endX,endY,mode="car") {
    const start={x:Math.floor(startX),y:Math.floor(startY)};
    const goal={x:Math.floor(endX),y:Math.floor(endY)};

    const open=[start];
    const came=new Map();
    const g=new Map([[key(start.x,start.y),0]]);
    const f=new Map([[key(start.x,start.y),heuristic(start,goal)]]);

    while (open.length) {
        let best=0;
        for (let i=1;i<open.length;i++) {
            if ((f.get(key(open[i].x,open[i].y)) ?? Infinity) <
                (f.get(key(open[best].x,open[best].y)) ?? Infinity)) best=i;
        }
        const current=open.splice(best,1)[0];

        if (current.x===goal.x && current.y===goal.y) {
            const path=[current];
            let k=key(current.x,current.y);
            while (came.has(k)) {
                const prev=came.get(k);
                path.push(prev);
                k=key(prev.x,prev.y);
            }
            path.reverse();
            return path.map(p=>({x:p.x+0.5,y:p.y+0.5}));
        }

        for (const n of neighbors(current,mode)) {
            const nk=key(n.x,n.y);
            const tentative=(g.get(key(current.x,current.y)) ?? Infinity)+1;
            if (tentative < (g.get(nk) ?? Infinity)) {
                came.set(nk,current);
                g.set(nk,tentative);
                f.set(nk,tentative+heuristic(n,goal));
                if (!open.some(p=>p.x===n.x && p.y===n.y)) open.push(n);
            }
        }
    }
    return [];
}

export function randomRoadPathTarget(roadTiles, random) {
    return roadTiles[Math.floor(random.next()*roadTiles.length)];
}
