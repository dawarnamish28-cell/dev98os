import { useState, useCallback, useRef } from 'react';
import { WindowState, AppDefinition } from '../types';

let nextZIndex = 100;

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const windowIdCounter = useRef(0);

  const openWindow = useCallback((app: AppDefinition) => {
    if (app.isExternal && app.externalUrl) {
      window.open(app.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const id = `window-${++windowIdCounter.current}`;
    const offset = (windowIdCounter.current % 8) * 24;
    const newWindow: WindowState = {
      id,
      appId: app.id,
      title: app.name,
      x: 80 + offset,
      y: 40 + offset,
      width: app.id === 'terminal' ? 640 : app.id === 'snake' || app.id === 'minesweeper' ? 400 : 500,
      height: app.id === 'terminal' ? 420 : app.id === 'snake' ? 440 : app.id === 'minesweeper' ? 480 : 380,
      minWidth: 200,
      minHeight: 150,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++nextZIndex,
      icon: app.icon,
    };
    setWindows(prev => [...prev, newWindow]);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          return { ...w, isMaximized: false };
        }
        return { ...w, isMaximized: true, zIndex: ++nextZIndex };
      })
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          return { ...w, zIndex: ++nextZIndex, isMinimized: false };
        }
        return w;
      })
    );
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, width: Math.max(w.minWidth, width), height: Math.max(w.minHeight, height) } : w))
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          return { ...w, isMinimized: false, zIndex: ++nextZIndex };
        }
        return w;
      })
    );
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    restoreWindow,
  };
}
