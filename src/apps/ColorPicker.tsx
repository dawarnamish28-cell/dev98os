import React, { useState } from 'react'

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100

  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }

  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255)
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

export default function ColorPicker() {
  const [hue, setHue] = useState(180)
  const [sat, setSat] = useState(70)
  const [light, setLight] = useState(50)

  const [savedColors, setSavedColors] = useState<string[]>([
    '#008080', '#000080', '#2d5a27',
    '#c6a84b', '#1a7a6d', '#c0c0c0'
  ])

  const rgb = hslToRgb(hue, sat, light)
  const hex = rgbToHex(rgb[0], rgb[1], rgb[2])

  const handleSave = () => {
    if (!savedColors.includes(hex)) {
      setSavedColors(prev => [...prev.slice(-11), hex])
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2">

      <div className="flex gap-2 mb-2">
        <div
          className="w-[80px] h-[80px] win98-border-sunken"
          style={{ backgroundColor: hex }}
        />

        <div className="flex-1">
          <div className="text-[11px] mb-1">
            <span className="font-bold">HEX:</span>{' '}
            <span
              className="font-mono cursor-pointer hover:underline"
              onClick={() => handleCopy(hex)}
            >
              {hex}
            </span>
          </div>

          <div className="text-[11px] mb-1">
            <span className="font-bold">RGB:</span>{' '}
            <span
              className="font-mono cursor-pointer hover:underline"
              onClick={() =>
                handleCopy(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
              }
            >
              {rgb[0]}, {rgb[1]}, {rgb[2]}
            </span>
          </div>

          <div className="text-[11px] mb-1">
            <span className="font-bold">HSL:</span>{' '}
            <span
              className="font-mono cursor-pointer hover:underline"
              onClick={() =>
                handleCopy(`hsl(${hue}, ${sat}%, ${light}%)`)
              }
            >
              {hue}, {sat}%, {light}%
            </span>
          </div>

          <div className="text-[10px] text-[#808080]">
            (Click values to copy)
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span>Hue</span>
            <span className="font-mono">{hue}</span>
          </div>

          <div className="win98-border-field p-[2px]">
            <div
              className="h-[16px] relative"
              style={{
                background:
                  'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            >
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={e => setHue(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-0 w-[3px] h-full bg-black border border-white pointer-events-none"
                style={{ left: `${(hue / 360) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span>Saturation</span>
            <span className="font-mono">{sat}%</span>
          </div>

          <div className="win98-border-field p-[2px]">
            <div
              className="h-[16px] relative"
              style={{
                background: `linear-gradient(to right, hsl(${hue}, 0%, ${light}%), hsl(${hue}, 100%, ${light}%))`
              }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={sat}
                onChange={e => setSat(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-0 w-[3px] h-full bg-black border border-white pointer-events-none"
                style={{ left: `${sat}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span>Lightness</span>
            <span className="font-mono">{light}%</span>
          </div>

          <div className="win98-border-field p-[2px]">
            <div
              className="h-[16px] relative"
              style={{
                background: `linear-gradient(to right, hsl(${hue}, ${sat}%, 0%), hsl(${hue}, ${sat}%, 50%), hsl(${hue}, ${sat}%, 100%))`
              }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={light}
                onChange={e => setLight(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-0 w-[3px] h-full bg-black border border-white pointer-events-none"
                style={{ left: `${light}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      <button
        className="win98-btn text-[11px] mb-2 self-start"
        onClick={handleSave}
      >
        Add to Custom Colors
      </button>

      <div className="text-[11px] mb-1 font-bold">Custom Colors:</div>

      <div className="flex flex-wrap gap-1">
        {savedColors.map((color, i) => (
          <div
            key={i}
            className="w-[20px] h-[20px] win98-border-sunken cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => {
              handleCopy(color)

              const r = parseInt(color.slice(1, 3), 16)
              const g = parseInt(color.slice(3, 5), 16)
              const b = parseInt(color.slice(5, 7), 16)

              const max = Math.max(r, g, b) / 255
              const min = Math.min(r, g, b) / 255
              const l = (max + min) / 2

              setLight(Math.round(l * 100))
            }}
            title={color}
          />
        ))}
      </div>

    </div>
  )
}
