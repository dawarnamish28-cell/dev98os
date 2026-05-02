import React from 'react';
import { AppDefinition } from '../types';
import * as Icons from 'lucide-react';

function getIcon(name: string, size = 48) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

interface StoreAppPlaceholderProps {
  app: AppDefinition;
}

export default function StoreAppPlaceholder({ app }: StoreAppPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#c0c0c0] p-6">
      <div className="win98-border-raised p-6 bg-[#c0c0c0] text-center max-w-[300px]">
        <div className="w-[64px] h-[64px] bg-white win98-border-sunken flex items-center justify-center mx-auto mb-3">
          {getIcon(app.icon, 40)}
        </div>
        <div className="text-[14px] font-bold mb-1">{app.name}</div>
        <div className="text-[10px] text-[#000080] mb-2">{app.category} -- {app.size}</div>
        <div className="win98-border-field bg-white p-3 mb-3">
          <p className="text-[11px] text-[#404040] leading-relaxed">
            {app.description}
          </p>
        </div>
        <div className="win98-border-sunken bg-[#fffff0] p-2">
          <p className="text-[11px] text-[#808080]">
            This app has been installed from the Dev98 App Store.
            Full functionality is coming in a future update.
          </p>
        </div>
        <div className="mt-3 text-[10px] text-[#808080]">
          Installed -- Ready
        </div>
      </div>
    </div>
  );
}
