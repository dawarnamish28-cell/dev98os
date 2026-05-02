import React, { useCallback, useRef, useEffect } from 'react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
  children: React.ReactNode;
}

export default function Window({
  window: win,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number; winX: number; winY: number; dir: string } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      e.preventDefault();
      onFocus(win.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        onMove(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.classList.remove('no-select');
      };

      document.body.classList.add('no-select');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [win.id, win.x, win.y, win.isMaximized, onFocus, onMove]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, dir: string) => {
      if (win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus(win.id);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winW: win.width,
        winH: win.height,
        winX: win.x,
        winY: win.y,
        dir,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!resizeRef.current) return;
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        let newW = resizeRef.current.winW;
        let newH = resizeRef.current.winH;
        let newX = resizeRef.current.winX;
        let newY = resizeRef.current.winY;

        if (dir.includes('e')) newW = resizeRef.current.winW + dx;
        if (dir.includes('s')) newH = resizeRef.current.winH + dy;
        if (dir.includes('w')) {
          newW = resizeRef.current.winW - dx;
          newX = resizeRef.current.winX + dx;
        }
        if (dir.includes('n')) {
          newH = resizeRef.current.winH - dy;
          newY = resizeRef.current.winY + dy;
        }

        if (newW >= win.minWidth && newH >= win.minHeight) {
          onResize(win.id, newW, newH);
          if (dir.includes('w') || dir.includes('n')) {
            onMove(win.id, newX, newY);
          }
        }
      };

      const handleMouseUp = () => {
        resizeRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.classList.remove('no-select');
      };

      document.body.classList.add('no-select');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [win.id, win.x, win.y, win.width, win.height, win.isMaximized, win.minWidth, win.minHeight, onFocus, onMove, onResize]
  );

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 36px)', zIndex: win.zIndex }
    : { position: 'absolute', top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      ref={windowRef}
      style={style}
      className="flex flex-col"
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Window outer frame */}
      <div className="flex flex-col h-full bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] shadow-[inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080]">
        {/* Title bar */}
        <div
          className={`flex items-center h-[22px] px-[3px] py-[2px] select-none shrink-0 ${
            isActive
              ? 'bg-gradient-to-r from-[#000080] to-[#1084d0]'
              : 'bg-gradient-to-r from-[#808080] to-[#b0b0b0]'
          }`}
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={() => onMaximize(win.id)}
        >
          <span className="text-white text-[12px] font-bold truncate flex-1 ml-1">
            {win.title}
          </span>
          <div className="flex gap-[2px] ml-2">
            <button
              className="win98-title-btn"
              onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
              title="Minimize"
            >
              <svg width="8" height="7" viewBox="0 0 8 7">
                <rect x="0" y="5" width="6" height="2" fill="black" />
              </svg>
            </button>
            <button
              className="win98-title-btn"
              onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}
              title="Maximize"
            >
              <svg width="8" height="7" viewBox="0 0 9 8">
                <rect x="0" y="0" width="9" height="8" fill="none" stroke="black" strokeWidth="1" />
                <rect x="0" y="0" width="9" height="2" fill="black" />
              </svg>
            </button>
            <button
              className="win98-title-btn"
              onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
              title="Close"
            >
              <svg width="8" height="7" viewBox="0 0 8 7">
                <line x1="0" y1="0" x2="7" y2="6" stroke="black" strokeWidth="1.5" />
                <line x1="7" y1="0" x2="0" y2="6" stroke="black" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Window content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {children}
        </div>
      </div>

      {/* Resize handles */}
      {!win.isMaximized && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="absolute top-0 right-0 bottom-0 w-1 cursor-e-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
        </>
      )}
    </div>
  );
}
