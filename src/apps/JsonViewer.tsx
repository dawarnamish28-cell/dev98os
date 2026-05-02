import React, { useState } from 'react';

function syntaxHighlight(json: string): string {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'text-[#0000ff]'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-[#800000] font-bold'; // key
        } else {
          cls = 'text-[#008000]'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-[#b22222]'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-[#808080]'; // null
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

export default function JsonViewer() {
  const [input, setInput] = useState('{\n  "name": "Dev98",\n  "version": "1.0",\n  "theme": "solarpunk",\n  "features": [\n    "calculator",\n    "terminal",\n    "snake"\n  ]\n}');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormatted(pretty);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setFormatted('');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const mini = JSON.stringify(parsed);
      setInput(mini);
      setFormatted('');
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleClear = () => {
    setInput('');
    setFormatted('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-b-[#808080]">
        <button className="win98-btn text-[11px] h-[22px]" onClick={handleFormat}>Format</button>
        <button className="win98-btn text-[11px] h-[22px]" onClick={handleMinify}>Minify</button>
        <button className="win98-btn text-[11px] h-[22px]" onClick={handleClear}>Clear</button>
        <button className="win98-btn text-[11px] h-[22px]" onClick={() => {
          try {
            JSON.parse(input);
            setError('');
            setFormatted('Valid JSON');
          } catch (e: any) {
            setError(e.message);
            setFormatted('');
          }
        }}>Validate</button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Input */}
        <div className="flex-1 flex flex-col p-1">
          <div className="text-[10px] text-[#808080] mb-1">Input</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="win98-textarea flex-1 w-full text-[11px]"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col p-1">
          <div className="text-[10px] text-[#808080] mb-1">Output</div>
          <div className="win98-border-field bg-white flex-1 overflow-auto p-1">
            {error ? (
              <div className="text-red-700 text-[11px] font-mono p-1">{error}</div>
            ) : formatted ? (
              <pre
                className="text-[11px] font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(formatted) }}
              />
            ) : (
              <div className="text-[#808080] text-[11px] p-1">Click Format to see output...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
