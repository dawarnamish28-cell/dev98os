export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  icon: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  size: string;
  description: string;
  installed: boolean;
  isExternal?: boolean;
  externalUrl?: string;
  component?: string;
}

export interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
  appId?: string;
  x: number;
  y: number;
}

export interface FileSystemNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
  content?: string;
  size?: string;
  modified?: string;
}

export interface StoreApp {
  id: string;
  name: string;
  icon: string;
  category: string;
  size: string;
  description: string;
  installed: boolean;
  rating: number;
  downloads: string;
}

export type Screen = 'boot' | 'login' | 'desktop';
