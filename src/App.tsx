import React, { useState, useCallback, useEffect } from 'react';
import { AppDefinition, Screen } from './types';
import { ALL_APPS, DESKTOP_ICONS, STORE_APPS } from './data/apps';
import { useWindowManager } from './hooks/useWindowManager';
import LoginScreen from './components/LoginScreen';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import Calculator from './apps/Calculator';
import JsonViewer from './apps/JsonViewer';
import ColorPicker from './apps/ColorPicker';
import MarkdownPreview from './apps/MarkdownPreview';
import Snake from './apps/Snake';
import Minesweeper from './apps/Minesweeper';
import Clock from './apps/Clock';
import Terminal from './apps/Terminal';
import TextEditor from './apps/TextEditor';
import FileManager from './apps/FileManager';
import AppStore from './apps/AppStore';
import MyComputer from './apps/MyComputer';
import StoreAppPlaceholder from './apps/StoreAppPlaceholder';

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const bootLines = [
      'Dev98 BIOS v1.0 - Solarpunk Edition',
      'Checking system memory... 128 MB OK',
      'Detecting hardware...',
      '  CPU: Browser Engine v1.0',
      '  Display: Active',
      '  Storage: Virtual 2.0 GB',
      'Loading Dev98 kernel...',
      'Initializing filesystem...',
      'Loading solarpunk theme engine...',
      'Starting desktop environment...',
      'Welcome to Dev98.',
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < bootLines.length) {
        setLines(prev => [...prev, bootLines[idx]]);
        setProgress(Math.min(100, ((idx + 1) / bootLines.length) * 100));
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(transparent 0, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px)',
        }}
      />

      <div className="relative z-20 w-[500px]">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a27] via-[#1a7a6d] to-[#000080] border border-[#7cb342] flex items-center justify-center">
              <span className="text-white text-xl font-bold font-pixel">98</span>
            </div>
            <div>
              <div className="text-white text-2xl font-bold font-pixel tracking-wider">Dev98</div>
              <div className="text-[#7cb342] text-[10px]">Solarpunk Edition</div>
            </div>
          </div>
        </div>

        {/* Boot log */}
        <div className="bg-[#0a0a0a] border border-[#333] p-3 font-mono text-[12px] h-[200px] overflow-hidden mb-3">
          {lines.map((line, i) => (
            <div key={i} className={`${line.startsWith('  ') ? 'text-[#808080]' : line.includes('OK') || line.includes('Welcome') ? 'text-[#7cb342]' : 'text-[#c0c0c0]'}`}>
              {line}
            </div>
          ))}
          <span className="text-[#7cb342] animate-pulse">_</span>
        </div>

        {/* Progress bar */}
        <div className="win98-progress">
          <div
            className="h-full bg-[#1a7a6d] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-[10px] text-[#808080] mt-2">
          Loading Dev98... {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('boot');
  const [username, setUsername] = useState('');
  const [installedApps, setInstalledApps] = useState<AppDefinition[]>(ALL_APPS);

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    restoreWindow,
  } = useWindowManager();

  const handleLogin = useCallback((name: string) => {
    setUsername(name);
    setScreen('desktop');
  }, []);

  const handleOpenApp = useCallback((app: AppDefinition) => {
    openWindow(app);
  }, [openWindow]);

  const handleInstallApp = useCallback((app: AppDefinition) => {
    setInstalledApps(prev => {
      if (prev.some(a => a.id === app.id)) return prev;
      return [...prev, app];
    });
  }, []);

  const handleUninstallApp = useCallback((appId: string) => {
    const coreApps = ALL_APPS.map(a => a.id);
    if (coreApps.includes(appId)) return;
    setInstalledApps(prev => prev.filter(a => a.id !== appId));
  }, []);

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'calculator': return <Calculator />;
      case 'json-viewer': return <JsonViewer />;
      case 'color-picker': return <ColorPicker />;
      case 'markdown-preview': return <MarkdownPreview />;
      case 'snake': return <Snake />;
      case 'minesweeper': return <Minesweeper />;
      case 'clock': return <Clock />;
      case 'terminal': return <Terminal />;
      case 'text-editor': return <TextEditor />;
      case 'file-manager': return <FileManager />;
      case 'app-store':
        return (
          <AppStore
            installedApps={installedApps}
            onInstallApp={handleInstallApp}
            onUninstallApp={handleUninstallApp}
          />
        );
      case 'my-computer': return <MyComputer />;
      default: {
        const appDef = installedApps.find(a => a.id === appId);
        if (appDef) {
          return <StoreAppPlaceholder app={appDef} />;
        }
        return (
          <div className="flex items-center justify-center h-full bg-[#c0c0c0] text-[11px] text-[#808080]">
            Application not found: {appId}
          </div>
        );
      }
    }
  };

  // Get highest z-index window
  const topWindowId = windows.length > 0
    ? windows.reduce((top, w) => w.zIndex > top.zIndex ? w : top, windows[0]).id
    : null;

  if (screen === 'boot') {
    return <BootScreen onComplete={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="w-full h-full flex flex-col relative scanlines" style={{ backgroundColor: '#008080' }}>
      {/* Desktop area */}
      <Desktop
        icons={DESKTOP_ICONS}
        onOpenApp={handleOpenApp}
        installedApps={installedApps}
      />

      {/* Windows */}
      {windows.map(win => (
        <Window
          key={win.id}
          window={win}
          isActive={win.id === topWindowId && !win.isMinimized}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={updateWindowPosition}
          onResize={updateWindowSize}
        >
          {renderAppContent(win.appId)}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onFocusWindow={focusWindow}
        onRestoreWindow={restoreWindow}
        onMinimizeWindow={minimizeWindow}
        onOpenApp={handleOpenApp}
        installedApps={installedApps}
      />
    </div>
  );
}
