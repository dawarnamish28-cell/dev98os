# Dev98 OS

A browser-based operating system inspired by classic Windows environments, redesigned for modern developers.

Live Demo: https://dev98os.vercel.app

---

## Overview

Dev98 OS is a fully interactive web-based desktop environment that simulates a traditional operating system inside the browser. It combines retro aesthetics with modern functionality, allowing users to open apps, manage windows, and interact with a complete UI system.

---

## Features

### Core System

* Boot screen with BIOS-style initialization
* Login and personalized welcome screen
* Fully interactive desktop environment
* Draggable desktop icons
* Right-click context menus
* Custom wallpaper support

---

### Window Manager

* Open, close, minimize, and maximize windows
* Drag and resize windows
* Focus handling (active window system)
* Taskbar integration

---

### Built-in Applications

* File Manager
* Terminal
* Text Editor
* Calculator
* JSON Viewer
* Markdown Preview
* Color Picker
* Clock
* App Store (install and uninstall apps)

---

### Games

* Snake
* Minesweeper

---

### Media

* Camera (webcam access and live preview)

---

### Productivity Suite (Code Crushers)

* Crusher Docs – lightweight document editor
* Crusher Sheets – spreadsheet-style grid
* Crusher Slides – presentation layout system

---

### UI/UX

* Windows 98-inspired design
* Custom icons (PNG assets with transparency)
* Smooth transitions and animations
* Responsive layout

---

## Tech Stack

* React
* TypeScript
* Vite
* CSS (custom styling, no UI libraries)

---

## Project Structure

```
webapp/
├── public/
│   └── upload_files/
├── src/
│   ├── apps/
│   ├── components/
│   ├── hooks/
│   ├── data/
│   └── App.tsx
├── package.json
└── vite.config.ts
```

---

## Setup and Run Locally

```bash
npm install
npm run dev
```

---

## Deployment

This project is deployed using Vercel:

https://dev98os.vercel.app

---

## Key Highlights

* Fully client-side OS simulation
* Modular app architecture
* Real-time window management system
* Extensible app ecosystem
* Clean separation of UI and system logic

---

## Future Improvements

* File persistence (local storage or cloud)
* Multi-user profiles
* Drag-and-drop file system
* More advanced applications (code editor, browser)
* Progressive Web App support

---

## Author

Namish Dawar

---

## Acknowledgement

If you find this project useful, consider starring the repository.
