import React, { useState } from 'react';

export default function TextEditor() {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('Untitled.txt');
  const [modified, setModified] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [statusMsg, setStatusMsg] = useState('Ready');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setModified(true);
  };

  const handleNew = () => {
    setContent('');
    setFilename('Untitled.txt');
    setModified(false);
    setStatusMsg('New file created');
  };

  const handleSave = () => {
    setModified(false);
    setStatusMsg(`Saved: ${filename}`);
  };

  const getStats = () => {
    const lines = content.split('\n').length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    return { lines, words, chars };
  };

  const stats = getStats();

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Menu bar */}
      <div className="flex text-[11px] border-b border-b-[#808080] px-1">
        <div className="relative group">
          <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer inline-block">File</span>
        </div>
        <div className="relative group">
          <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer inline-block">Edit</span>
        </div>
        <div className="relative group">
          <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer inline-block" onClick={() => setWordWrap(!wordWrap)}>
            Format
          </span>
        </div>
        <div className="relative group">
          <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer inline-block">Help</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-b-[#808080]">
        <button className="win98-btn text-[11px] h-[22px]" onClick={handleNew}>New</button>
        <button className="win98-btn text-[11px] h-[22px]" onClick={handleSave}>Save</button>
        <div className="w-[1px] h-[18px] bg-[#808080] mx-1" />
        <button className="win98-btn text-[11px] h-[22px]" onClick={() => {
          navigator.clipboard.writeText(content).catch(() => {});
          setStatusMsg('Copied to clipboard');
        }}>Copy All</button>
        <button className="win98-btn text-[11px] h-[22px]" onClick={() => setWordWrap(!wordWrap)}>
          {wordWrap ? 'No Wrap' : 'Wrap'}
        </button>
        <div className="flex-1" />
        <div className="win98-border-field bg-white px-2 h-[20px] flex items-center min-w-[120px]">
          <input
            type="text"
            value={filename}
            onChange={(e) => { setFilename(e.target.value); setModified(true); }}
            className="bg-transparent text-[11px] outline-none border-none w-full"
          />
        </div>
      </div>

      {/* Editor area */}
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 win98-textarea m-1 text-[12px] leading-[1.4]"
        style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre', overflowWrap: wordWrap ? 'break-word' : 'normal' }}
        spellCheck={false}
        placeholder="Start typing..."
      />

      {/* Status bar */}
      <div className="flex items-center h-[20px] border-t-2 border-t-[#808080] text-[10px] px-1">
        <div className="flex-1 win98-border-sunken px-2 h-[16px] flex items-center">
          {statusMsg}{modified ? ' *' : ''}
        </div>
        <div className="win98-border-sunken px-2 h-[16px] flex items-center ml-1 min-w-[80px]">
          Ln {stats.lines}
        </div>
        <div className="win98-border-sunken px-2 h-[16px] flex items-center ml-1 min-w-[80px]">
          Words: {stats.words}
        </div>
        <div className="win98-border-sunken px-2 h-[16px] flex items-center ml-1 min-w-[80px]">
          Chars: {stats.chars}
        </div>
      </div>
    </div>
  );
}
