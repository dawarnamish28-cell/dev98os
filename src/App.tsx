import React, { useState, useEffect, useCallback } from 'react';
import { ALL_APPS, DESKTOP_ICONS } from './data/apps';
import { useWindowManager } from './hooks/useWindowManager';

import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import LoginScreen from './components/LoginScreen';

import FileManager from './apps/FileManager';
import Calculator from './apps/Calculator';
import Terminal from './apps/Terminal';
import TextEditor from './apps/TextEditor';
import AppStore from './apps/AppStore';

import Snake from './apps/Snake';
import Minesweeper from './apps/Minesweeper';
import Clock from './apps/Clock';
import JsonViewer from './apps/JsonViewer';
import ColorPicker from './apps/ColorPicker';
import MarkdownPreview from './apps/MarkdownPreview';
import MyComputer from './apps/MyComputer';

import Camera from './apps/upload_files/camera';
import CrusherDocs from './apps/upload_files/CrusherDocs';
import CrusherSheets from './apps/upload_files/CrusherSheets';
import CrusherSlides from './apps/upload_files/CrusherSlides';
import PhotoshopCrash from './apps/upload_files/PhotoshopCrash';

type Screen = 'boot' | 'login' | 'welcome' | 'desktop';

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const lines = [
    "Dev98 BIOS v1.0",
    "Initializing memory...",
    "Mounting filesystem...",
    "Starting kernel...",
    "Loading UI engine...",
    "Launching Dev98...",
    "",
    "Ready."
  ];

  const [visible, setVisible] = useState<string[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i < lines.length) {
      const t = setTimeout(() => {
        setVisible(v => [...v, lines[i]]);
        setI(i + 1);
      }, 100);
      return () => clearTimeout(t);
    } else {
      setTimeout(onComplete, 600);
    }
  }, [i, onComplete]);

  return (
    <div style={{
      background: 'black',
      color: '#00ff9f',
      height: '100vh',
      padding: 20,
      fontFamily: 'monospace'
    }}>
      {visible.map((l, idx) => <div key={idx}>{l}</div>)}
      <span>█</span>
    </div>
  );
}

function WelcomeScreen({ username, onDone }: { username: string, onDone: () => void }) {
  const [text, setText] = useState('');
  const full = `Hello, ${username}`;

  useEffect(() => {
    let i = 0;

    const type = setInterval(() => {
      setText(full.slice(0, i));
      i++;

      if (i > full.length) {
        clearInterval(type);
        setTimeout(onDone, 1000);
      }
    }, 50);

    return () => clearInterval(type);
  }, [username, onDone]);

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(#000080, black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 40,
      fontFamily: 'sans-serif'
    }}>
      {text}
    </div>
  );
}

export default function App() {

  const [screen, setScreen] = useState<Screen>('boot');
  const [username, setUsername] = useState('User');

  const [desktopIcons, setDesktopIcons] = useState(DESKTOP_ICONS);
  const [installedApps, setInstalledApps] = useState(ALL_APPS);
  const [wallpaper, setWallpaper] = useState('/upload_files/wal3.jpg');

  const [isCrashed, setIsCrashed] = useState(false);

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

  const triggerCrash = useCallback(() => {
    setIsCrashed(true);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCrashed(false);
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const renderApp = (appId: string) => {
    switch (appId) {
      case 'my-computer': return <MyComputer />;
      case 'file-manager': return <FileManager />;
      case 'calculator': return <Calculator />;
      case 'terminal': return <Terminal />;
      case 'text-editor': return <TextEditor />;

      case 'app-store':
        return (
          <AppStore
            installedApps={installedApps}
            onInstallApp={(app) => setInstalledApps(p => [...p, app])}
            onUninstallApp={(id) => setInstalledApps(p => p.filter(a => a.id !== id))}
          />
        );

      case 'snake': return <Snake />;
      case 'minesweeper': return <Minesweeper />;
      case 'clock': return <Clock />;
      case 'json-viewer': return <JsonViewer />;
      case 'color-picker': return <ColorPicker />;
      case 'markdown-preview': return <MarkdownPreview />;

      case 'camera': return <Camera />;
      case 'crusher-docs': return <CrusherDocs />;
      case 'crusher-sheets': return <CrusherSheets />;
      case 'crusher-slides': return <CrusherSlides />;

      case 'photoshop':
        return <PhotoshopCrash onCrash={triggerCrash} />;

      default:
        return <div style={{ padding: 20 }}>App not found: {appId}</div>;
    }
  };

  const handleOpenApp = useCallback((app: any) => {
  if (!app) return;

  // external apps (like CollabCode)
  if (app.url) {
    window.open(app.url, '_blank');
    return;
  }

  // internal apps
  openWindow(app);
}, [openWindow]);

  const handleDeleteApp = (appId: string) => {
    setInstalledApps(p => p.filter(a => a.id !== appId));
    setDesktopIcons(p => p.filter(i => i.appId !== appId));
  };

  if (screen === 'boot')
    return <BootScreen onComplete={() => setScreen('login')} />;

  if (screen === 'login')
    return (
      <LoginScreen
        onLogin={(name) => {
          setUsername(name || 'User');
          setScreen('welcome');
        }}
      />
    );

  if (screen === 'welcome')
    return <WelcomeScreen username={username} onDone={() => setScreen('desktop')} />;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, position: 'relative' }}>

        <Desktop
          username={username}
          icons={desktopIcons}
          setIcons={setDesktopIcons}
          installedApps={installedApps}
          onOpenApp={handleOpenApp}
          onDeleteApp={handleDeleteApp}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
        />

        {!isCrashed && windows.map((win: any) => (
          <Window
            key={win.id}
            window={win}
            isActive={!win.isMinimized}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onMove={updateWindowPosition}
            onResize={updateWindowSize}
          >
            {renderApp(win.appId)}
          </Window>
        ))}

        {isCrashed && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#000080',
            zIndex: 9999
          }}>
            <PhotoshopCrash />
          </div>
        )}

      </div>

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
