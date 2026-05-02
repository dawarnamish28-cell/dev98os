# Dev98 - A Solarpunk WebOS

## Project Overview
- **Name**: Dev98
- **Goal**: A Windows 98-themed WebOS with solarpunk design accents, built for a hackathon
- **Stack**: React 18 + TypeScript + TailwindCSS + Vite
- **Theme**: Windows 98 retro aesthetic with solarpunk green/teal/gold accents

## Features

### Core System
- Boot sequence with animated progress
- Login/Signup screen (no auth required, just UI flow)
- Draggable, resizable windows with minimize/maximize/close
- Taskbar with Start menu, quick launch, open app tracking, system tray clock
- Desktop icons with single-click select and double-click open
- Scanline CRT overlay effect
- Solarpunk gradient accents throughout

### Pre-installed Apps (7 core apps)
| App | Category | Size | Description |
|-----|----------|------|-------------|
| Calculator | Utilities | 128 KB | Full arithmetic calculator with MC/CE/backspace |
| JSON Viewer | Development | 96 KB | Parse, format, validate, minify JSON |
| Color Picker | Utilities | 64 KB | HSL sliders with HEX/RGB/HSL output and palette |
| Markdown Preview | Development | 192 KB | Split-pane live Markdown editor and renderer |
| Snake | Games | 48 KB | Classic snake with score tracking and speed ramp |
| Minesweeper | Games | 96 KB | 9x9 grid, flagging, timer, mine counter |
| Clock | Utilities | 80 KB | Analog clock with canvas rendering + stopwatch |

### System Apps
| App | Description |
|-----|-------------|
| Terminal | Full command-line emulator with filesystem, command history, tab completion, neofetch |
| Text Editor | Notepad-style editor with word wrap, stats, clipboard |
| File Manager | Dual-pane file browser with tree sidebar, list/icon views |
| My Computer | System info, drive status, hardware details |
| App Store | Browse, search, install/uninstall additional apps |
| CollabCode | Opens collabcodeforall.vercel.app in a new tab |

### Desktop Icons
- My Computer
- My Documents
- Recycle Bin
- Code Editor
- File Manager
- Terminal
- Text Editor
- CollabCode

### Terminal Commands
help, cls/clear, dir/ls, cd, type/cat, echo, pwd, date, time, whoami, hostname, set, ver, tree, mkdir, touch, color, neofetch, exit

### App Store
Browse and install additional apps:
- Paint (Graphics)
- Music Player (Media)
- Weather (Utilities)
- Chat Room (Communication)
- Todo List (Productivity)
- Camera (Media)

## Technical Architecture

### Project Structure
```
src/
  App.tsx              Main app with boot screen, login, desktop
  main.tsx             React entry point
  types.ts             TypeScript interfaces
  styles/index.css     Win98 theme CSS + Tailwind
  hooks/
    useWindowManager.ts  Window state management (open/close/minimize/maximize/drag/resize)
  components/
    Window.tsx           Draggable/resizable window frame
    Desktop.tsx          Desktop icons with selection
    Taskbar.tsx          Start menu, quick launch, window list, system tray
    LoginScreen.tsx      Login/signup form
  apps/
    Calculator.tsx
    JsonViewer.tsx
    ColorPicker.tsx
    MarkdownPreview.tsx
    Snake.tsx
    Minesweeper.tsx
    Clock.tsx
    Terminal.tsx
    TextEditor.tsx
    FileManager.tsx
    AppStore.tsx
    MyComputer.tsx
    StoreAppPlaceholder.tsx
  data/
    apps.ts              App definitions, desktop icons, filesystem tree, store catalog
```

### Design Decisions
- Pure React state management (no external state library)
- Pixel-perfect Windows 98 borders using CSS box-shadow and border-color tricks
- Canvas-based analog clock rendering
- Virtual filesystem for Terminal and File Manager
- Solarpunk accents via green/teal/gold gradients on boot screen, login, terminal prompt, store header

## Development

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Production build
npm run start        # Dev server on 0.0.0.0:3000
```

## Hackathon Notes
- No authentication required -- login screen is purely cosmetic
- All apps run entirely in the browser, no backend needed
- CollabCode links to external app at collabcodeforall.vercel.app
- Store apps show placeholder after install (demo feature)
- Built with accessibility in mind (keyboard nav, focus indicators)
