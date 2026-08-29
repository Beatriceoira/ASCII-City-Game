# ASCII City

A pseudo-3D city rendered entirely from ASCII characters using JavaScript and HTML Canvas.

The project is built from scratch without Unity, Unreal Engine, Three.js, 3D models, textures, or shaders.

The renderer uses raycasting, perspective projection, a depth buffer, ASCII sprites, distance-based lighting, and dynamic entities to create the illusion of a 3D city.

---

# Version 3

Version 3 introduces dynamic environmental rendering and a more convincing city atmosphere.

## Features

- DDA raycasting
- Perspective projection
- Depth buffer
- ASCII rendering
- Distance-based brightness
- Atmospheric fog
- Buildings with different heights
- Building windows
- Street lights
- Traffic lights
- Cars
- Pedestrians
- Trees
- Dynamic entities
- Collision detection
- WASD movement
- Arrow-key rotation
- Mouse look
- Minimap
- FPS counter
- Day/night lighting
- Local street-light illumination
- Colored ASCII
- Road markings

---

# Technologies

- HTML5
- CSS3
- JavaScript
- HTML Canvas
- ES Modules

No external libraries are required.

---

# Project Structure

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