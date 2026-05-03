import { AppDefinition, DesktopIcon, FileSystemNode } from '../types';

export const ALL_APPS: AppDefinition[] = [
  { id: 'my-computer', name: 'My Computer', icon: '/upload_files/mycomp-removebg-preview.png', category: 'System', size: '64 KB', description: 'View system info', installed: true },
  { id: 'file-manager', name: 'File Manager', icon: '/upload_files/folder-removebg-preview.png', category: 'Utilities', size: '180 KB', description: 'Browse files', installed: true },
  { id: 'calculator', name: 'Calculator', icon: '/upload_files/calculator-removebg-preview.png', category: 'Utilities', size: '128 KB', description: 'Basic calculator', installed: true },
  { id: 'terminal', name: 'Terminal', icon: '/upload_files/terminal-removebg-preview.png', category: 'Development', size: '256 KB', description: 'Command line', installed: true },
  { id: 'text-editor', name: 'Text Editor', icon: '/upload_files/docs-removebg-preview.png', category: 'Development', size: '160 KB', description: 'Simple editor', installed: true },
  { id: 'app-store', name: 'App Store', icon: '/upload_files/folder-removebg-preview.png', category: 'System', size: '320 KB', description: 'Install apps', installed: true },
  { id: 'collabcode', name: 'CollabCode', icon: 'Code', category: 'Development', size: '--', description: 'Real-Time Collaborative coding', installed: true , url:'https://collabcodeforall.vercel.app'},
  { id: 'snake', name: 'Snake', icon: 'Gamepad2', category: 'Games', size: '48 KB', description: 'Snake game', installed: true },
  { id: 'minesweeper', name: 'Minesweeper', icon: 'Bomb', category: 'Games', size: '96 KB', description: 'Minesweeper', installed: true },

  { id: 'clock', name: 'Clock', icon: 'Clock', category: 'Utilities', size: '80 KB', description: 'Clock app', installed: true },
  { id: 'json-viewer', name: 'JSON Viewer', icon: 'Braces', category: 'Development', size: '96 KB', description: 'View JSON', installed: true },
  { id: 'color-picker', name: 'Color Picker', icon: 'Palette', category: 'Utilities', size: '64 KB', description: 'Pick colors', installed: true },
  { id: 'markdown-preview', name: 'Markdown Preview', icon: 'FileText', category: 'Development', size: '192 KB', description: 'Preview markdown', installed: true },

  { id: 'camera', name: 'Camera', icon: '/upload_files/camera-removebg-preview.png', category: 'Media', size: '512 KB', description: 'Webcam capture app', installed: true },

  { id: 'crusher-docs', name: 'Crusher Docs', icon: '/upload_files/docs-removebg-preview.png', category: 'Productivity', size: '300 KB', description: 'Document editor', installed: true },
  { id: 'crusher-sheets', name: 'Crusher Sheets', icon: '/upload_files/sheets-removebg-preview.png', category: 'Productivity', size: '320 KB', description: 'Spreadsheet', installed: true },
  { id: 'crusher-slides', name: 'Crusher Slides', icon: '/upload_files/slides-removebg-preview.png', category: 'Productivity', size: '340 KB', description: 'Presentation tool', installed: true },

  { id: 'photoshop', name: 'Photoshop', icon: '/upload_files/bsoh.png', category: 'Graphics', size: '12 MB', description: 'Totally legit photoshop', installed: true }
];

export const STORE_APPS: AppDefinition[] = [
  { id: 'paint', name: 'Paint', icon: '/upload_files/folder-removebg-preview.png', category: 'Graphics', size: '256 KB', description: 'Drawing tool', installed: false },
  { id: 'music-player', name: 'Music Player', icon: 'Music', category: 'Media', size: '384 KB', description: 'Play music', installed: false },
  { id: 'weather', name: 'Weather', icon: 'CloudSun', category: 'Utilities', size: '128 KB', description: 'Weather app', installed: false },
  { id: 'chat', name: 'Chat Room', icon: 'MessageSquare', category: 'Communication', size: '192 KB', description: 'Chat app', installed: false },
  { id: 'todo', name: 'Todo List', icon: 'ListChecks', category: 'Productivity', size: '96 KB', description: 'Tasks', installed: false }
];

export const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'icon-mycomputer', label: 'My Computer', icon: '/upload_files/mycomp-removebg-preview.png', appId: 'my-computer', x: 20, y: 20 },
  { id: 'icon-files', label: 'Files', icon: '/upload_files/folder-removebg-preview.png', appId: 'file-manager', x: 20, y: 110 },
  { id: 'icon-terminal', label: 'Terminal', icon: '/upload_files/terminal-removebg-preview.png', appId: 'terminal', x: 20, y: 200 },
  { id: 'icon-editor', label: 'Text Editor', icon: '/upload_files/docs-removebg-preview.png', appId: 'text-editor', x: 20, y: 290 },
  { id: 'icon-store', label: 'App Store', icon: '/upload_files/folder-removebg-preview.png', appId: 'app-store', x: 20, y: 380 },
  { id: 'icon-snake', label: 'Snake', icon: 'Gamepad2', appId: 'snake', x: 20, y: 470 },
  { id: 'icon-minesweeper', label: 'Minesweeper', icon: 'Bomb', appId: 'minesweeper', x: 20, y: 560 },
  { id: 'icon-collabcode', label: 'CollabCode', icon: 'Code', appId: 'collabcode', x: 200, y: 300 },

  { id: 'icon-calculator', label: 'Calculator', icon: '/upload_files/calculator-removebg-preview.png', appId: 'calculator', x: 110, y: 20 },
  { id: 'icon-clock', label: 'Clock', icon: 'Clock', appId: 'clock', x: 110, y: 110 },
  { id: 'icon-json', label: 'JSON Viewer', icon: 'Braces', appId: 'json-viewer', x: 110, y: 200 },
  { id: 'icon-color', label: 'Color Picker', icon: 'Palette', appId: 'color-picker', x: 110, y: 290 },
  { id: 'icon-md', label: 'Markdown', icon: 'FileText', appId: 'markdown-preview', x: 110, y: 380 },

  { id: 'icon-camera', label: 'Camera', icon: '/upload_files/camera-removebg-preview.png', appId: 'camera', x: 110, y: 470 },
  { id: 'icon-photoshop', label: 'Photoshop', icon: '/upload_files/bsoh.png', appId: 'photoshop', x: 110, y: 560 },

  { id: 'icon-docs', label: 'Crusher Docs', icon: '/upload_files/docs-removebg-preview.png', appId: 'crusher-docs', x: 200, y: 20 },
  { id: 'icon-sheets', label: 'Crusher Sheets', icon: '/upload_files/sheets-removebg-preview.png', appId: 'crusher-sheets', x: 200, y: 110 },
  { id: 'icon-slides', label: 'Crusher Slides', icon: '/upload_files/slides-removebg-preview.png', appId: 'crusher-slides', x: 200, y: 200 }
];

export const FILE_SYSTEM: FileSystemNode = {
  name: 'C:',
  type: 'folder',
  children: [
    {
      name: 'My Documents',
      type: 'folder',
      children: [
        {
          name: 'readme.txt',
          type: 'file',
          content: 'Welcome to Dev98',
          size: '256 B',
          modified: '2026-05-02'
        }
      ]
    }
  ]
};
