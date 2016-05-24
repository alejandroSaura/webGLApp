# WebGLApp

This is a quick experiment about how to set up the hierarchy of a basic game app with web GL.

In the source folder you can find an "Engine" module and the "Entity" module. 
The Engine holds the game loop and the general drawing code, calling his list of entities to transform and render them.
The Entity abstracts the initialization, transformation and render of each individual entity.

We are using a simple albedo shader applied to a cube to render the scene.

This project will be further developed to form a basic web 3D game engine. 
Stay tuned for updates.
