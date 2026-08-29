# ASCII City — Version 5

A browser-based ASCII city simulation built with **HTML, CSS, JavaScript and Canvas**.

No Unity, Unreal Engine, 3D models, textures, or shaders are required.

## Version 5 features

- Raycast-based first-person ASCII renderer
- Distance-based brightness and atmospheric fading
- Dynamic day/night lighting
- Procedural seeded city generation
- Traffic AI
- Vehicle spawning and despawning
- Vehicle destinations
- A* road pathfinding
- Vehicle following distance
- Traffic signals with timed phases
- Basic traffic-light stopping rules
- Pedestrian AI
- Pedestrian destinations
- Pedestrian state machine
- Crosswalk-aware road crossing
- NPC destinations in residential, office, commercial, restaurant and school buildings
- Population simulation
- Rush-hour activity levels
- Dynamic minimap
- Mouse-look and keyboard movement
- City regeneration
- Pause/resume simulation

## Controls

| Key | Action |
|---|---|
| W / S | Move forward/back |
| A / D | Turn |
| Q / E | Strafe |
| Arrow keys | Movement/turning |
| Shift | Sprint |
| Mouse | Look |
| N | Toggle day/night |
| R | Generate a new city |
| P | Pause simulation |
| ESC | Release mouse |

Click the canvas to capture the mouse.

## Project structure

```text
ascii-city/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── renderer.js
│   ├── raycaster.js
│   ├── world.js
│   ├── player.js
│   ├── entities.js
│   ├── lighting.js
│   ├── input.js
│   ├── pathfinding.js
│   └── simulation.js
└── README.md
```

## Running

Use VS Code with the **Live Server** extension, or another local HTTP server. Because the project uses ES modules (`import` / `export`), opening `index.html` directly with `file://` can cause browser security/module issues.

## Architecture

```text
main.js
  |
  +-- CitySimulation
  |     +-- Traffic AI
  |     +-- Pedestrian AI
  |     +-- Population
  |     +-- Traffic signals
  |
  +-- Player/Input
  |
  +-- Renderer
        +-- Raycaster
        +-- Lighting
        +-- ASCII output
```

## Notes

The population number is a simulation statistic; it does not mean 25,000 individual NPC objects are rendered. Only a manageable active subset of vehicles and pedestrians is simulated on the map.
