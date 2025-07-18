# Three.js Geometry High Vertex Value Test

A test project demonstrating rendering bugs in Three.js when geometries are positioned far from the origin using vertex offsets instead of object positioning.

## Purpose

This project tests the behavior of Three.js when geometries have high vertex values (far from origin) versus when objects are positioned using the standard `position` property. The test reveals that using `geometry.translate()` to offset vertices can cause visible rendering artifacts.

## Test Setup

The scene contains three spheres positioned at different distances from the origin:

1. **Red Sphere**: Uses `geometry.translate(offset)` to move vertices far from origin
2. **Green Sphere**: Uses standard `object.position.add(offset)` 
3. **Blue Sphere**: Uses standard `object.position.add(offset)`

All spheres are positioned at the same visual location, but the red sphere demonstrates rendering bugs due to high vertex values.

## Key Finding

**Important**: When geometries have vertices with very high coordinate values (far from origin), Three.js can exhibit rendering artifacts including:
- Z-fighting issues
- Incorrect depth sorting
- Visual glitches and artifacts
- Performance degradation

## Best Practice

Always keep geometries as close to the origin (0,0,0) as possible and use object positioning (`mesh.position`) to place objects in the scene. Avoid using `geometry.translate()` for large offsets.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```