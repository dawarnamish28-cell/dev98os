import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FILE_SYSTEM } from '../data/apps';
import { FileSystemNode } from '../types';

interface HistoryEntry {
  command: string;
  output: string;
  isError?: boolean;
}

function findNode(path: string[], fs: FileSystemNode): FileSystemNode | null {
  let current = fs;
  for (const part of path) {
    if (part === '' || part === '.') continue;
    if (part === '..') continue;
    if (current.type !== 'folder' || !current.children) return null;
    const child = current.children.find(c => c.name.toLowerCase() === part.toLowerCase());
    if (!child) return null;
    current = child;
  }
  return current;
}

function resolvePath(currentPath: string[], input: string): string[] {
  if (input.startsWith('C:\\') || input.startsWith('C:/') || input === 'C:') {
    const parts = input.replace('C:', '').split(/[/\\]/).filter(Boolean);
    return parts;
  }
  const parts = input.split(/[/\\]/).filter(Boolean);
  const result = [...currentPath];
  for (const part of parts) {
    if (part === '..') {
      result.pop();
    } else if (part !== '.') {
      result.push(part);
    }
  }
  return result;
}

function getPathString(path: string[]): string {
  return 'C:\\' + path.join('\\');
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: '',
      output: `Dev98 Terminal [Version 98.0.2026]\n(C) Dev98 Corporation. All rights reserved.\n\nType "help" for available commands.\n`,
    },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [env, setEnv] = useState<Record<string, string>>({
    PATH: 'C:\\Windows\\System32',
    USERNAME: 'user',
    COMPUTERNAME: 'DEV98',
    OS: 'Dev98 WebOS',
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, { command: cmd, output: '' }]);
      return;
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    let output = '';
    let isError = false;

    switch (command) {
      case 'help': {
        output = [
          'Available commands:',
          '  help          Show this help message',
          '  cls / clear   Clear the screen',
          '  dir / ls      List directory contents',
          '  cd <path>     Change directory',
          '  type <file>   Display file contents',
          '  cat <file>    Display file contents',
          '  echo <text>   Display text',
          '  pwd           Print working directory',
          '  date          Display current date',
          '  time          Display current time',
          '  whoami        Display current user',
          '  hostname      Display computer name',
          '  set           Display environment variables',
          '  set <k>=<v>   Set environment variable',
          '  ver           Display version',
          '  tree          Display directory tree',
          '  mkdir <name>  Create directory (simulated)',
          '  touch <name>  Create file (simulated)',
          '  color         Show color test',
          '  neofetch      System information',
          '  exit          Close terminal',
          '',
          'Navigation: Up/Down arrows for command history',
        ].join('\n');
        break;
      }

      case 'cls':
      case 'clear': {
        setHistory([]);
        return;
      }

      case 'dir':
      case 'ls': {
        const targetPath = args.length > 0 ? resolvePath(currentPath, args[0]) : currentPath;
        const node = findNode(targetPath, FILE_SYSTEM);
        if (!node || node.type !== 'folder') {
          output = 'The system cannot find the path specified.';
          isError = true;
        } else {
          const lines = [
            ` Directory of ${getPathString(targetPath)}`,
            '',
          ];
          if (node.children) {
            for (const child of node.children) {
              const date = child.modified || '2026-05-02';
              if (child.type === 'folder') {
                lines.push(`${date}    <DIR>          ${child.name}`);
              } else {
                lines.push(`${date}              ${(child.size || '0 B').padStart(8)}  ${child.name}`);
              }
            }
            const dirs = node.children.filter(c => c.type === 'folder').length;
            const files = node.children.filter(c => c.type === 'file').length;
            lines.push('');
            lines.push(`               ${files} File(s)`);
            lines.push(`               ${dirs} Dir(s)`);
          } else {
            lines.push('               0 File(s)');
            lines.push('               0 Dir(s)');
          }
          output = lines.join('\n');
        }
        break;
      }

      case 'cd': {
        if (args.length === 0) {
          output = getPathString(currentPath);
        } else {
          const newPath = resolvePath(currentPath, args[0]);
          const node = findNode(newPath, FILE_SYSTEM);
          if (!node || node.type !== 'folder') {
            output = 'The system cannot find the path specified.';
            isError = true;
          } else {
            setCurrentPath(newPath);
            output = '';
          }
        }
        break;
      }

      case 'type':
      case 'cat': {
        if (args.length === 0) {
          output = 'The syntax of the command is incorrect.';
          isError = true;
        } else {
          const filePath = resolvePath(currentPath, args[0]);
          const node = findNode(filePath, FILE_SYSTEM);
          if (!node || node.type !== 'file') {
            output = `The system cannot find the file specified: ${args[0]}`;
            isError = true;
          } else {
            output = node.content || '(empty file)';
          }
        }
        break;
      }

      case 'echo': {
        output = args.join(' ');
        break;
      }

      case 'pwd': {
        output = getPathString(currentPath);
        break;
      }

      case 'date': {
        output = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        break;
      }

      case 'time': {
        output = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        break;
      }

      case 'whoami': {
        output = env.USERNAME || 'user';
        break;
      }

      case 'hostname': {
        output = env.COMPUTERNAME || 'DEV98';
        break;
      }

      case 'set': {
        if (args.length === 0) {
          output = Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n');
        } else {
          const full = args.join(' ');
          const eqIdx = full.indexOf('=');
          if (eqIdx === -1) {
            const val = env[full.toUpperCase()];
            output = val !== undefined ? `${full.toUpperCase()}=${val}` : `Environment variable ${full} not defined`;
          } else {
            const key = full.slice(0, eqIdx).toUpperCase();
            const val = full.slice(eqIdx + 1);
            setEnv(prev => ({ ...prev, [key]: val }));
            output = `${key}=${val}`;
          }
        }
        break;
      }

      case 'ver':
      case 'version': {
        output = 'Dev98 [Version 98.0.2026.05]\nSolarpunk Edition';
        break;
      }

      case 'tree': {
        const targetPath = args.length > 0 ? resolvePath(currentPath, args[0]) : currentPath;
        const node = findNode(targetPath, FILE_SYSTEM);
        if (!node || node.type !== 'folder') {
          output = 'Invalid path.';
          isError = true;
        } else {
          const lines: string[] = [getPathString(targetPath)];
          const drawTree = (n: FileSystemNode, prefix: string) => {
            if (!n.children) return;
            n.children.forEach((child, i) => {
              const isLast = i === n.children!.length - 1;
              const connector = isLast ? '\\-- ' : '|-- ';
              lines.push(prefix + connector + child.name);
              if (child.type === 'folder') {
                drawTree(child, prefix + (isLast ? '    ' : '|   '));
              }
            });
          };
          drawTree(node, '');
          output = lines.join('\n');
        }
        break;
      }

      case 'mkdir': {
        if (args.length === 0) {
          output = 'The syntax of the command is incorrect.';
          isError = true;
        } else {
          output = `Directory created: ${args[0]} (simulated)`;
        }
        break;
      }

      case 'touch': {
        if (args.length === 0) {
          output = 'The syntax of the command is incorrect.';
          isError = true;
        } else {
          output = `File created: ${args[0]} (simulated)`;
        }
        break;
      }

      case 'color': {
        output = [
          '\x1b[31m  RED   \x1b[0m \x1b[32m GREEN \x1b[0m \x1b[34m BLUE  \x1b[0m',
          ' ##### ##### #####',
          ' ##### ##### #####',
          ' ##### ##### #####',
          '',
          'Solarpunk Palette:',
          ' #2d5a27 - Forest Green',
          ' #7cb342 - Lime',
          ' #c6a84b - Gold',
          ' #1a7a6d - Teal',
          ' #4a7c59 - Moss',
        ].join('\n');
        break;
      }

      case 'neofetch': {
        output = [
          '         .---.         user@DEV98',
          '        /     \\        ----------------',
          '       |  98   |       OS: Dev98 WebOS',
          '        \\ ___ /        Host: Browser',
          '       /|     |\\       Kernel: React 18',
          '      / |     | \\      Uptime: since login',
          '     /  |     |  \\     Shell: dev98sh',
          '    /   |_____|   \\    Theme: Solarpunk',
          '   /    |     |    \\   Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
          '  /     |     |     \\  Terminal: Dev98 Terminal',
          ' /_____/       \\_____\\ CPU: Browser Engine',
          '                       Memory: ~128MB (virtual)',
        ].join('\n');
        break;
      }

      case 'exit': {
        output = 'Cannot exit: Terminal is a core system process.';
        break;
      }

      default: {
        output = `'${command}' is not recognized as an internal or external command,\noperable program or batch file. Type "help" for a list of commands.`;
        isError = true;
      }
    }

    setHistory(prev => [...prev, { command: cmd, output, isError }]);
  }, [currentPath, env]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    if (input.trim()) {
      setCmdHistory(prev => [...prev, input]);
    }
    setHistoryIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx >= cmdHistory.length - 1) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        const newIdx = historyIdx + 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const node = findNode(currentPath, FILE_SYSTEM);
      if (node && node.children) {
        const partial = input.split(/\s+/).pop() || '';
        const matches = node.children.filter(c =>
          c.name.toLowerCase().startsWith(partial.toLowerCase())
        );
        if (matches.length === 1) {
          const parts = input.split(/\s+/);
          parts[parts.length - 1] = matches[0].name;
          setInput(parts.join(' '));
        }
      }
    }
  };

  const prompt = `${getPathString(currentPath)}>`;

  return (
    <div
      className="flex flex-col h-full bg-[#0c0c0c] font-mono text-[13px] cursor-text overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-auto p-2 pb-0">
        {history.map((entry, i) => (
          <div key={i} className="mb-0">
            {entry.command !== '' && (
              <div className="text-[#c0c0c0]">
                <span className="text-[#7cb342]">{prompt}</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre className={`whitespace-pre-wrap ${entry.isError ? 'text-[#c6a84b]' : 'text-[#c0c0c0]'}`}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center text-[#c0c0c0] mb-2">
          <span className="text-[#7cb342] shrink-0">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#c0c0c0] outline-none border-none font-mono text-[13px] caret-[#7cb342] ml-0"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
