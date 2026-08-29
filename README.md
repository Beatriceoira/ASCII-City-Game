# ASCII City

A lightweight first-person pseudo-3D city rendered entirely with JavaScript, HTML Canvas, and ASCII characters.

The project explores how a 3D-like environment can be created without a traditional 3D engine, models, textures, or shaders.

## Features

- First-person camera
- Grid-based city
- Raycasting renderer
- Perspective projection
- WASD movement
- Arrow-key camera rotation
- Mouse look
- Collision detection
- ASCII-based rendering
- Distance-based brightness
- Atmospheric depth/fog
- Buildings
- Trees
- Cars
- Pedestrians
- Simple NPC movement
- Real-time FPS counter
- Minimap-ready architecture

## Technologies

- HTML5
- CSS3
- JavaScript
- HTML Canvas
- ES Modules

No external libraries are required.

## Project Structure

```text
ascii-city/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── renderer.js
│   ├── raycaster.js
│   ├── world.js
│   ├── player.js
│   ├── entities.js
│   ├── lighting.js
│   └── input.js
│
└── README.md