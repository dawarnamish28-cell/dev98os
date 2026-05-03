import React, { useState, useEffect, useRef } from 'react';
import { WindowState, AppDefinition } from '../types';
import { ALL_APPS } from '../data/apps';
import * as Icons from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  onFocusWindow: (id: string) => void;
  onRestoreWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onOpenApp: (app: AppDefinition) => void;
  installedApps: AppDefinition[];
}

function getIcon(name: string, size = 16) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

export default function Taskbar({
  windows,
  onFocusWindow,
  onRestoreWindow,
  onMinimizeWindow,
  onOpenApp,
  installedApps,
}: TaskbarProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDate(
        now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        startMenuRef.current &&
        !startMenuRef.current.contains(e.target as Node) &&
        startBtnRef.current &&
        !startBtnRef.current.contains(e.target as Node)
      ) {
        setStartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const categories = ['Development', 'Utilities', 'Games', 'System'];

  const groupedApps = categories.reduce((acc, cat) => {
    acc[cat] = installedApps.filter(a => a.category === cat);
    return acc;
  }, {} as Record<string, AppDefinition[]>);

  return (
    <div className="h-[36px] bg-[#c0c0c0] border-t-2 border-t-white flex items-center px-[2px] shrink-0 relative z-[10000]">
      <button
        ref={startBtnRef}
        className={`h-[28px] px-2 flex items-center gap-1 font-bold text-[11px] border-2 mr-1 ${
          startOpen
            ? 'border-[#404040] border-r-white border-b-white shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#dfdfdf] start-btn-active'
            : 'border-white border-r-[#404040] border-b-[#404040] shadow-[inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080]'
        } bg-[#c0c0c0] cursor-pointer select-none`}
        onClick={() => setStartOpen(!startOpen)}
      >
        <div className="w-4 h-4 bg-gradient-to-br from-[#2d5a27] to-[#1a7a6d] flex items-center justify-center">
          <span className="text-white text-[9px] font-bold leading-none">98</span>
        </div>
        <span>Start</span>
      </button>

      <div className="w-[2px] h-[24px] border-l border-l-[#808080] border-r border-r-white mx-1" />

      <div className="flex items-center gap-[2px] mr-1">
        {['terminal', 'text-editor', 'file-manager'].map(appId => {
          const app = installedApps.find(a => a.id === appId);
          if (!app) return null;
          return (
            <button
              key={appId}
              className="w-[24px] h-[24px] flex items-center justify-center hover:border hover:border-white hover:border-r-[#808080] hover:border-b-[#808080] cursor-pointer"
              onClick={() => onOpenApp(app)}
              title={app.name}
            >
              {getIcon(app.icon, 16)}
            </button>
          );
        })}
      </div>

      <div className="w-[2px] h-[24px] border-l border-l-[#808080] border-r border-r-white mx-1" />

      <div className="flex-1 flex items-center gap-[2px] overflow-hidden">
        {windows.map(win => (
          <button
            key={win.id}
            className={`h-[24px] px-2 flex items-center gap-1 text-[11px] truncate min-w-[120px] max-w-[160px] border-2 cursor-pointer ${
              !win.isMinimized
                ? 'border-[#404040] border-r-white border-b-white shadow-[inset_1px_1px_0_#808080] bg-[#c0c0c0] font-bold'
                : 'border-white border-r-[#404040] border-b-[#404040] shadow-[inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080] bg-[#c0c0c0]'
            }`}
            onClick={() => {
              if (win.isMinimized) {
                onRestoreWindow(win.id);
              } else {
                onMinimizeWindow(win.id);
              }
            }}
          >
            {getIcon(win.icon, 14)}
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="w-[2px] h-[24px] border-l border-l-[#808080] border-r border-r-white mx-1" />
      <div className="flex items-center h-[24px] px-2 border-2 border-[#808080] border-r-white border-b-white shadow-[inset_1px_1px_0_#404040]">
        <Icons.Volume2 size={14} className="mr-2 text-[#404040]" />
        <div className="text-[11px] text-black leading-tight text-right">
          <div>{time}</div>
        </div>
      </div>

      {startOpen && (
        <div
          ref={startMenuRef}
          className="absolute bottom-[36px] left-0 bg-[#c0c0c0] border-2 border-white border-r-[#404040] border-b-[#404040] shadow-[2px_2px_0_rgba(0,0,0,0.3)] min-w-[200px] flex"
        >
          <div className="w-[24px] bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end pb-2">
            <span className="text-white text-[11px] font-bold writing-mode-vertical transform -rotate-90 whitespace-nowrap origin-bottom-left translate-x-[18px]">
              Dev98
            </span>
          </div>

          <div className="flex-1 py-1">
            {categories.map(cat => (
              <React.Fragment key={cat}>
                <div className="px-3 py-1 text-[10px] text-[#808080] font-bold">{cat}</div>
                {(groupedApps[cat] || []).map(app => (
                  <button
                    key={app.id}
                    className="w-full flex items-center gap-2 px-3 py-[3px] text-[11px] text-left hover:bg-[#000080] hover:text-white cursor-pointer"
                    onClick={() => {
                      onOpenApp(app);
                      setStartOpen(false);
                    }}
                  >
                    {getIcon(app.icon, 16)}
                    <span>{app.name}</span>
                  </button>
                ))}
              </React.Fragment>
            ))}
            <div className="h-[1px] bg-[#808080] mx-2 my-1 border-b border-b-white" />
            <button
              className="w-full flex items-center gap-2 px-3 py-[3px] text-[11px] text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              onClick={() => {
                const storeApp = installedApps.find(a => a.id === 'app-store');
                if (storeApp) onOpenApp(storeApp);
                setStartOpen(false);
              }}
            >
              <Icons.ShoppingBag size={16} />
              <span>App Store</span>
            </button>
            <div className="h-[1px] bg-[#808080] mx-2 my-1 border-b border-b-white" />
            <button
              className="w-full flex items-center gap-2 px-3 py-[3px] text-[11px] text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              onClick={() => setStartOpen(false)}
            >
              <Icons.Power size={16} />
              <span>Shut Down...</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
