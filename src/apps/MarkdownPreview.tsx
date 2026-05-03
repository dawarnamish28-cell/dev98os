import React, { useState } from 'react'
import { marked } from 'marked'

const DEFAULT_MD = `# Welcome to Dev98 Markdown
## A Solarpunk WebOS

This is the **Markdown Preview** app. Write markdown on the left and see it rendered on the right.

### Features
- Live preview
- Standard markdown syntax
- Code blocks
- Tables and lists

### Code Example
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}
greet("Dev98");
\`\`\`

### Table Example
| App | Category | Size |
|-----|----------|------|
| Calculator | Utilities | 128 KB |
| Snake | Games | 48 KB |
| Terminal | Dev | 256 KB |

> "The future is solarpunk." -- Dev98

---
*Built for the hackathon.*
`

export default function MarkdownPreview() {
  const [md, setMd] = useState(DEFAULT_MD)

  const getHtml = () => {
    try {
      return marked.parse(md, { async: false }) as string
    } catch {
      return '<p>Error parsing markdown</p>'
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">

      <div className="flex items-center gap-1 p-1 border-b border-b-[#808080]">
        <button
          className="win98-btn text-[11px] h-[22px]"
          onClick={() => setMd(DEFAULT_MD)}
        >
          Reset
        </button>

        <button
          className="win98-btn text-[11px] h-[22px]"
          onClick={() => setMd('')}
        >
          Clear
        </button>

        <button
          className="win98-btn text-[11px] h-[22px]"
          onClick={() => {
            navigator.clipboard.writeText(getHtml()).catch(() => {})
          }}
        >
          Copy HTML
        </button>
      </div>

      <div className="flex flex-1 min-h-0">

        <div className="flex-1 flex flex-col p-1">
          <div className="text-[10px] text-[#808080] mb-1">Markdown</div>

          <textarea
            value={md}
            onChange={e => setMd(e.target.value)}
            className="win98-textarea flex-1 w-full text-[11px]"
            spellCheck={false}
          />
        </div>

        <div className="flex-1 flex flex-col p-1">
          <div className="text-[10px] text-[#808080] mb-1">Preview</div>

          <div
            className="win98-border-field bg-white flex-1 overflow-auto p-2 text-[12px]"
            dangerouslySetInnerHTML={{ __html: getHtml() }}
            style={{ lineHeight: '1.5' }}
          />
        </div>

      </div>

      <style>{`
        .win98-border-field h1 { font-size: 18px; font-weight: bold; margin: 8px 0 4px; border-bottom: 1px solid #c0c0c0; padding-bottom: 4px; }
        .win98-border-field h2 { font-size: 15px; font-weight: bold; margin: 6px 0 3px; }
        .win98-border-field h3 { font-size: 13px; font-weight: bold; margin: 4px 0 2px; }
        .win98-border-field p { margin: 4px 0; }
        .win98-border-field ul, .win98-border-field ol { padding-left: 20px; margin: 4px 0; }
        .win98-border-field li { margin: 2px 0; }
        .win98-border-field code { background: #e8e8e8; padding: 1px 3px; font-family: 'Courier New', monospace; font-size: 11px; }
        .win98-border-field pre { background: #1a1a2e; color: #7cb342; padding: 8px; margin: 4px 0; overflow-x: auto; border: 1px solid #808080; }
        .win98-border-field pre code { background: transparent; color: inherit; }
        .win98-border-field blockquote { border-left: 3px solid #000080; padding-left: 8px; margin: 4px 0; color: #404040; font-style: italic; }
        .win98-border-field table { border-collapse: collapse; margin: 4px 0; width: 100%; }
        .win98-border-field th, .win98-border-field td { border: 1px solid #808080; padding: 3px 6px; text-align: left; font-size: 11px; }
        .win98-border-field th { background: #c0c0c0; font-weight: bold; }
        .win98-border-field hr { border: none; border-top: 1px solid #808080; margin: 8px 0; }
        .win98-border-field strong { font-weight: bold; }
        .win98-border-field em { font-style: italic; }
        .win98-border-field a { color: #000080; text-decoration: underline; }
      `}</style>

    </div>
  )
}
