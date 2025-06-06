# Prelude of the Chambered

A modern TypeScript conversion of Notch's [Prelude of the Chambered 48-hour game](http://s3.amazonaws.com/ld48/index.html).

This project modernizes the original Java codebase to TypeScript, making it runnable in web browsers while maintaining the original game mechanics.

## Prerequisites
* Node.js 18 or higher
* npm

## Installation
```bash
npm install
```

## How to run

### Development mode
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Type checking
```bash
npm run typecheck
```

## Project Structure
- `src/ts/` - TypeScript source code (modernized version)
- `src/com/mojang/escape/` - Original Java source code
- `res/` - Game assets (textures, sounds, levels)
- `dist/` - Built application

## About
This is a faithful recreation of the classic dungeon crawler game originally created by Markus "Notch" Persson during a 48-hour game jam. The game features multiple levels, combat mechanics, and puzzle-solving elements.
