ASCII City

A custom pseudo-3D city renderer built from scratch using JavaScript, HTML Canvas, and ASCII characters.

The project does not use Unity, Unreal Engine, Three.js, 3D models, textures, or shaders.

The goal is to explore how a small 3D-like environment can be rendered using raycasting, perspective projection, depth buffering, and ASCII characters.


Version 2

Version 2 introduces a proper depth-aware rendering architecture.

Features

- First-person camera
- DDA raycasting
- Perspective projection
- Depth buffer
- ASCII framebuffer
- Distance-based lighting
- Atmospheric fog
- Buildings with different heights
- Multi-character tree sprites
- Multi-character car sprites
- Pedestrian sprites
- Moving cars
- Moving pedestrians
- Collision detection
- WASD movement
- Arrow-key rotation
- Mouse look
- Minimap
- FPS counter
- Vanilla JavaScript
- No external libraries

Technologies

- HTML5
- CSS3
- JavaScript
- HTML Canvas
- JavaScript ES Modules

No external dependencies are required.

Project Structure

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