# Three.js Project

A simple Three.js project with orbit controls, grid, and animated cubes.

## Features

- Three.js scene with orbit controls
- Grid helper for reference
- Three colored cubes (red, green, blue) that rotate
- Proper lighting and shadows
- Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Controls

- **Mouse drag**: Rotate the camera around the scene
- **Mouse wheel**: Zoom in/out
- **Right mouse drag**: Pan the camera

## Project Structure

```
├── src/
│   └── main.ts          # Main Three.js application
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Build

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
``` 