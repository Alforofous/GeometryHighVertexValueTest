# Three.js Geometry High Vertex Value Test

A test project demonstrating rendering bugs in Three.js when geometries are positioned far from the origin using vertex offsets instead of object positioning.

## Purpose

This project tests the behavior of Three.js when geometries have high vertex values (far from origin) versus when objects are positioned using the standard `position` property. The test reveals that using `geometry.translate()` to offset vertices with high values can cause visible rendering artifacts.

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