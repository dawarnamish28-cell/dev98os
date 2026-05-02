import React, { useState } from 'react';
import { AppDefinition } from '../types';
import { STORE_APPS } from '../data/apps';
import * as Icons from 'lucide-react';

function getIcon(name: string, size = 24) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

interface AppStoreProps {
  installedApps: AppDefinition[];
  onInstallApp: (app: AppDefinition) => void;
  onUninstallApp: (appId: string) => void;
}

export default function AppStore({ installedApps, onInstallApp, onUninstallApp }: AppStoreProps) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [installing, setInstalling] = useState<string | null>(null);
  const [tab, setTab] = useState<'browse' | 'installed'>('browse');

  const categories = ['All', ...Array.from(new Set(STORE_APPS.map(a => a.category)))];

  const filteredApps = STORE_APPS.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
                        app.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'All' || app.category === selectedCat;
    return matchSearch && matchCat;
  });

  const isInstalled = (appId: string) => installedApps.some(a => a.id === appId);

  const handleInstall = async (app: AppDefinition) => {
    setInstalling(app.id);
    // Simulate install delay
    await new Promise(r => setTimeout(r, 1200));
    onInstallApp({ ...app, installed: true });
    setInstalling(null);
  };

  const handleUninstall = async (appId: string) => {
    setInstalling(appId);
    await new Promise(r => setTimeout(r, 800));
    onUninstallApp(appId);
    setInstalling(null);
  };

  const userInstalledApps = installedApps.filter(a =>
    STORE_APPS.some(s => s.id === a.id)
  );

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d5a27] to-[#1a7a6d] p-3 border-b-2 border-b-[#808080]">
        <div className="flex items-center gap-2">
          <Icons.ShoppingBag size={20} className="text-white" />
          <span className="text-white font-bold text-[14px]">Dev98 App Store</span>
        </div>
        <div className="mt-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps..."
            className="win98-input w-full h-[22px] text-[11px]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-b-[#808080]">
        <button
          className={`px-4 py-1 text-[11px] ${tab === 'browse' ? 'bg-[#c0c0c0] font-bold border-b-2 border-b-[#000080]' : 'bg-[#b0b0b0]'}`}
          onClick={() => setTab('browse')}
        >
          Browse
        </button>
        <button
          className={`px-4 py-1 text-[11px] ${tab === 'installed' ? 'bg-[#c0c0c0] font-bold border-b-2 border-b-[#000080]' : 'bg-[#b0b0b0]'}`}
          onClick={() => setTab('installed')}
        >
          Installed ({userInstalledApps.length})
        </button>
      </div>

      {tab === 'browse' ? (
        <div className="flex flex-1 min-h-0">
          {/* Categories sidebar */}
          <div className="w-[100px] border-r border-r-[#808080] overflow-auto p-1">
            {categories.map(cat => (
              <button
                key={cat}
                className={`w-full text-left text-[11px] px-2 py-1 cursor-pointer ${
                  selectedCat === cat ? 'bg-[#000080] text-white' : 'hover:bg-[#dfdfdf]'
                }`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* App grid */}
          <div className="flex-1 overflow-auto p-2">
            {filteredApps.length === 0 ? (
              <div className="text-center text-[#808080] text-[11px] mt-8">
                No apps found matching your search.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredApps.map(app => (
                  <div
                    key={app.id}
                    className="win98-border-raised p-2 flex items-start gap-3"
                  >
                    <div className="w-[40px] h-[40px] bg-white win98-border-sunken flex items-center justify-center shrink-0">
                      {getIcon(app.icon, 24)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[12px]">{app.name}</span>
                        <span className="text-[10px] text-[#808080]">{app.size}</span>
                      </div>
                      <div className="text-[10px] text-[#000080] mb-1">{app.category}</div>
                      <div className="text-[11px] text-[#404040]">{app.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-[10px] text-[#808080]">
                          {app.downloads || '1.2k'} downloads
                        </div>
                        {isInstalled(app.id) ? (
                          <button
                            className="win98-btn text-[10px] h-[20px] min-w-[70px]"
                            onClick={() => handleUninstall(app.id)}
                            disabled={installing === app.id}
                          >
                            {installing === app.id ? 'Removing...' : 'Uninstall'}
                          </button>
                        ) : (
                          <button
                            className="win98-btn text-[10px] h-[20px] min-w-[70px] font-bold"
                            onClick={() => handleInstall(app)}
                            disabled={installing === app.id}
                          >
                            {installing === app.id ? 'Installing...' : 'Install'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-2">
          {userInstalledApps.length === 0 ? (
            <div className="text-center text-[#808080] text-[11px] mt-8">
              No store apps installed yet. Browse the store to find apps.
            </div>
          ) : (
            <div className="space-y-2">
              {userInstalledApps.map(app => (
                <div
                  key={app.id}
                  className="win98-border-raised p-2 flex items-center gap-3"
                >
                  <div className="w-[32px] h-[32px] bg-white win98-border-sunken flex items-center justify-center shrink-0">
                    {getIcon(app.icon, 20)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[12px]">{app.name}</div>
                    <div className="text-[10px] text-[#808080]">{app.category} - {app.size}</div>
                  </div>
                  <button
                    className="win98-btn text-[10px] h-[20px]"
                    onClick={() => handleUninstall(app.id)}
                    disabled={installing === app.id}
                  >
                    {installing === app.id ? 'Removing...' : 'Uninstall'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center h-[20px] border-t-2 border-t-[#808080] text-[10px] px-1">
        <div className="flex-1 win98-border-sunken px-2 h-[16px] flex items-center">
          {STORE_APPS.length} apps available
        </div>
        <div className="win98-border-sunken px-2 h-[16px] flex items-center ml-1">
          {userInstalledApps.length} installed
        </div>
      </div>
    </div>
  );
}
