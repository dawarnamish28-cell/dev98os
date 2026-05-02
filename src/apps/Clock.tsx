import React, { useState, useEffect, useRef } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [tab, setTab] = useState<'clock' | 'stopwatch'>('clock');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swRef = useRef<number | null>(null);
  const swStartRef = useRef<number>(0);
  const swAccum = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || tab !== 'clock') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 180;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    // Face
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fffff0';
    ctx.fill();
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner border
    ctx.beginPath();
    ctx.arc(center, center, radius - 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const inner = radius - 12;
      const outer = radius - 5;
      ctx.beginPath();
      ctx.moveTo(center + inner * Math.cos(angle), center + inner * Math.sin(angle));
      ctx.lineTo(center + outer * Math.cos(angle), center + outer * Math.sin(angle));
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Numbers
      const numRadius = radius - 22;
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px "MS Sans Serif", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const num = i === 0 ? 12 : i;
      ctx.fillText(String(num), center + numRadius * Math.cos(angle), center + numRadius * Math.sin(angle));
    }

    // Minute markers
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = (i * Math.PI) / 30 - Math.PI / 2;
      const inner = radius - 7;
      const outer = radius - 5;
      ctx.beginPath();
      ctx.moveTo(center + inner * Math.cos(angle), center + inner * Math.sin(angle));
      ctx.lineTo(center + outer * Math.cos(angle), center + outer * Math.sin(angle));
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Hour hand
    const hAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + (radius * 0.5) * Math.cos(hAngle), center + (radius * 0.5) * Math.sin(hAngle));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Minute hand
    const mAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + (radius * 0.7) * Math.cos(mAngle), center + (radius * 0.7) * Math.sin(mAngle));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Second hand
    const sAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + (radius * 0.75) * Math.cos(sAngle), center + (radius * 0.75) * Math.sin(sAngle));
    ctx.strokeStyle = '#c6a84b';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(center, center, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#c6a84b';
    ctx.fill();
  }, [time, tab]);

  // Stopwatch
  useEffect(() => {
    if (swRunning) {
      swStartRef.current = performance.now();
      swRef.current = window.setInterval(() => {
        setStopwatchMs(swAccum.current + (performance.now() - swStartRef.current));
      }, 10);
    } else {
      if (swRef.current) {
        clearInterval(swRef.current);
        swAccum.current = stopwatchMs;
      }
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning]);

  const formatStopwatch = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const centisec = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(centisec).padStart(2, '0')}`;
  };

  const resetStopwatch = () => {
    setSwRunning(false);
    setStopwatchMs(0);
    swAccum.current = 0;
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Tabs */}
      <div className="flex px-2 pt-1">
        <button
          className={`px-3 py-1 text-[11px] border-2 border-b-0 mr-[-1px] ${
            tab === 'clock'
              ? 'bg-[#c0c0c0] border-white border-r-[#404040] z-10 relative'
              : 'bg-[#b0b0b0] border-[#808080] border-r-[#404040]'
          }`}
          onClick={() => setTab('clock')}
        >
          Clock
        </button>
        <button
          className={`px-3 py-1 text-[11px] border-2 border-b-0 ${
            tab === 'stopwatch'
              ? 'bg-[#c0c0c0] border-white border-r-[#404040] z-10 relative'
              : 'bg-[#b0b0b0] border-[#808080] border-r-[#404040]'
          }`}
          onClick={() => setTab('stopwatch')}
        >
          Stopwatch
        </button>
      </div>

      <div className="flex-1 border-2 border-white border-r-[#404040] border-b-[#404040] mx-2 mb-2 p-3">
        {tab === 'clock' ? (
          <div className="flex flex-col items-center">
            <canvas ref={canvasRef} width={180} height={180} className="mb-2" />
            <div className="text-[20px] font-mono font-bold text-center">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-[12px] text-[#808080] mt-1">
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="win98-border-field bg-white w-full max-w-[200px] text-center py-4 mb-3">
              <div className="text-[32px] font-mono font-bold">
                {formatStopwatch(stopwatchMs)}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="win98-btn text-[11px]"
                onClick={() => setSwRunning(!swRunning)}
              >
                {swRunning ? 'Stop' : 'Start'}
              </button>
              <button
                className="win98-btn text-[11px]"
                onClick={resetStopwatch}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
