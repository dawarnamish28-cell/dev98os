import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

export default function Desktop({
  icons = [],
  setIcons,
  installedApps = [],
  onOpenApp,
  onDeleteApp,
  wallpaper,
  setWallpaper
}: any) {

  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<any>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const offset = useRef({ x: 0, y: 0 });
  const fileInput = useRef<HTMLInputElement>(null);

  const getIcon = (icon: string) => {
    if (icon.startsWith('/')) {
      return (
        <img
          src={icon}
          alt="icon"
          style={{
            width: 42,
            height: 42,
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
      );
    }

    const Icon = (Icons as any)[icon];
    return Icon
      ? <Icon size={32} />
      : (
          <div style={{
            width: 32,
            height: 32,
            background: '#888'
          }} />
        );
  };

  const startDrag = (e: any, icon: any) => {
    offset.current = {
      x: e.clientX - icon.x,
      y: e.clientY - icon.y
    };
    setDragging(icon.id);
  };

  const onDrag = (e: any) => {
    if (!dragging) return;

    setIcons((prev: any[]) =>
      prev.map(icon =>
        icon.id === dragging
          ? {
              ...icon,
              x: e.clientX - offset.current.x,
              y: e.clientY - offset.current.y
            }
          : icon
      )
    );
  };

  const stopDrag = () => setDragging(null);

  const uploadWallpaper = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setWallpaper(url);
    localStorage.setItem('wallpaper', url);
  };

  return (
    <div
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onClick={() => {
        setSelected(null);
        setMenu(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY, type: 'desktop' });
      }}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#008080',
        cursor: "url('https://cur.cursors-4u.net/windows/win-1/win16.cur'), default"
      }}
    >

      {icons.map((icon: any) => {
        const app = installedApps.find((a: any) => a.id === icon.appId);

        return (
          <div
            key={icon.id}
            style={{
              position: 'absolute',
              left: icon.x,
              top: icon.y,
              width: 80,
              padding: 6,
              textAlign: 'center',
              cursor: 'default',
              color: 'white',
              border: selected === icon.id ? '1px dotted white' : '1px solid transparent',
              background: selected === icon.id
                ? 'rgba(0,0,128,0.7)'
                : 'rgba(0,0,0,0.4)',
              borderRadius: 4
            }}
            onMouseDown={(e) => startDrag(e, icon)}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(icon.id);
            }}
            onDoubleClick={() => app && onOpenApp(app)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenu({ x: e.clientX, y: e.clientY, type: 'icon', icon });
            }}
          >
            <div>{getIcon(icon.icon)}</div>
            <div style={{ fontSize: 11 }}>{icon.label}</div>
          </div>
        );
      })}

      {menu && (
        <div
          style={{
            position: 'absolute',
            top: menu.y,
            left: menu.x,
            background: '#c0c0c0',
            border: '2px outset white',
            zIndex: 9999,
            width: 180,
            fontSize: 12
          }}
        >
          {menu.type === 'desktop' && (
            <>
              <div
                style={{ padding: 6, cursor: 'pointer' }}
                onClick={() => {
                  fileInput.current?.click();
                  setMenu(null);
                }}
              >
                Change Wallpaper
              </div>

              <div
                style={{ padding: 6, cursor: 'pointer' }}
                onClick={() => {
                  setWallpaper('/upload_files/wal3.jpg');
                  localStorage.removeItem('wallpaper');
                  setMenu(null);
                }}
              >
                Reset Wallpaper
              </div>
            </>
          )}

          {menu.type === 'icon' && (
            <>
              <div
                style={{ padding: 6, cursor: 'pointer' }}
                onClick={() => {
                  const app = installedApps.find((a: any) => a.id === menu.icon.appId);
                  if (app) onOpenApp(app);
                  setMenu(null);
                }}
              >
                Open
              </div>

              <div
                style={{ padding: 6, cursor: 'pointer', color: 'red' }}
                onClick={() => {
                  onDeleteApp(menu.icon.appId);
                  setMenu(null);
                }}
              >
                Delete
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        style={{ display: 'none' }}
        onChange={uploadWallpaper}
      />
    </div>
  );
}
