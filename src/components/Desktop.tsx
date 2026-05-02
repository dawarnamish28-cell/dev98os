import React, { useState } from 'react';
import { DesktopIcon as DesktopIconType, AppDefinition } from '../types';
import * as Icons from 'lucide-react';

interface DesktopProps {
  icons: DesktopIconType[];
  onOpenApp: (app: AppDefinition) => void;
  installedApps: AppDefinition[];
}

function getIcon(name: string, size = 32) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

export default function Desktop({ icons, onOpenApp, installedApps }: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleIconClick = (iconId: string) => {
    setSelectedIcon(iconId);
  };

  const handleIconDoubleClick = (icon: DesktopIconType) => {
    if (icon.appId) {
      const app = installedApps.find(a => a.id === icon.appId);
      if (app) onOpenApp(app);
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'desktop-area') {
      setSelectedIcon(null);
    }
  };

  return (
    <div
      id="desktop-area"
      className="flex-1 relative overflow-hidden"
      onClick={handleDesktopClick}
    >
      {/* Solarpunk subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(45,90,39,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(26,122,109,0.2) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(198,168,75,0.1) 0%, transparent 70%)`,
        }}
      />

      {icons.map(icon => (
        <div
          key={icon.id}
          className={`absolute w-[72px] flex flex-col items-center gap-1 cursor-pointer p-1 ${
            selectedIcon === icon.id ? 'desktop-icon-selected' : ''
          }`}
          style={{ left: icon.x, top: icon.y }}
          onClick={(e) => { e.stopPropagation(); handleIconClick(icon.id); }}
          onDoubleClick={() => handleIconDoubleClick(icon)}
        >
          <div className={`w-[32px] h-[32px] flex items-center justify-center ${
            selectedIcon === icon.id ? 'opacity-70' : ''
          }`}>
            <div className="text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              {getIcon(icon.icon, 32)}
            </div>
          </div>
          <span
            className={`desktop-icon-label text-[11px] text-center leading-tight px-[2px] max-w-[70px] break-words ${
              selectedIcon === icon.id
                ? 'bg-[#000080] text-white'
                : 'text-white'
            }`}
            style={{ textShadow: selectedIcon === icon.id ? 'none' : '1px 1px 0 #000' }}
          >
            {icon.label}
          </span>
        </div>
      ))}
    </div>
  );
}
