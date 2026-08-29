ASCII City

A pseudo-3D procedural city rendered entirely from ASCII characters using JavaScript and HTML Canvas.

No Unity.

No Unreal Engine.

No 3D models.

No textures.

No Three.js.

No shaders.

The project uses a custom raycasting renderer to create the illusion of a 3D city using characters.



Version 4

Version 4 introduces procedural city generation.

Instead of manually designing every building, the engine generates a city from a numerical seed.

The same seed produces the same city.

A different seed produces a different city.

Version 4 Features

- Procedural city generation
- Seeded random number generator
- Procedural roads
- Procedural buildings
- Variable building heights
- Multiple building types
- Procedural parks
- Procedural trees
- Procedural cars
- Procedural pedestrians
- Procedural street lights
- Procedural traffic lights
- Building windows
- Day/night lighting
- Local light sources
- Distance-based brightness
- Atmospheric fog
- Raycasting
- DDA ray traversal
- Depth buffer
- Perspective projection
- Collision detection
- Mouse look
- WASD movement
- Minimap
- Runtime city regeneration

Project Structure

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