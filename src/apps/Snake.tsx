import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 16;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const dirRef = useRef<Direction>('RIGHT');
  const gameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let pos: Point;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(generateFood(initial));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setRunning(false);
  }, [generateFood]);

  const tick = useCallback(() => {
    setSnake(prev => {
      const head = { ...prev[0] };
      const dir = dirRef.current;

      switch (dir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setRunning(false);
        return prev;
      }

      if (prev.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setRunning(false);
        return prev;
      }

      const newSnake = [head, ...prev];

      setFood(currentFood => {
        if (head.x === currentFood.x && head.y === currentFood.y) {
          setScore(s => {
            const newScore = s + 10;
            setHighScore(h => Math.max(h, newScore));
            if (newScore % 50 === 0) {
              setSpeed(sp => Math.max(50, sp - 10));
            }
            return newScore;
          });
          const nextFood = generateFood(newSnake);
          return nextFood;
        } else {
          newSnake.pop();
          return currentFood;
        }
      });

      return newSnake;
    });
  }, [generateFood]);

  useEffect(() => {
    if (running && !gameOver) {
      gameRef.current = window.setInterval(tick, speed);
    }
    return () => {
      if (gameRef.current) clearInterval(gameRef.current);
    };
  }, [running, gameOver, tick, speed]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (!running && !gameOver && (e.key === ' ' || e.key === 'Enter')) {
        setRunning(true);
        return;
      }

      const current = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (current !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); }
          break;
        case 'ArrowDown':
        case 's':
          if (current !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); }
          break;
        case 'ArrowLeft':
        case 'a':
          if (current !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); }
          break;
        case 'ArrowRight':
        case 'd':
          if (current !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); }
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running, gameOver]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-[#c0c0c0] p-2 outline-none" tabIndex={0}>
      {/* Status bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 text-[11px]">
          <span>Score: <strong>{score}</strong></span>
          <span>High: <strong>{highScore}</strong></span>
        </div>
        <div className="flex gap-1">
          <button className="win98-btn text-[11px] h-[20px] min-w-[60px]" onClick={() => { if (!running) setRunning(true); }}>
            {gameOver ? 'Game Over' : running ? 'Playing' : 'Start'}
          </button>
          <button className="win98-btn text-[11px] h-[20px] min-w-[50px]" onClick={resetGame}>
            New
          </button>
        </div>
      </div>

      {/* Game board */}
      <div className="flex justify-center">
        <div
          className="win98-border-sunken relative"
          style={{
            width: GRID_SIZE * CELL_SIZE + 4,
            height: GRID_SIZE * CELL_SIZE + 4,
            background: '#1a2e1a',
          }}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-[2px]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(45,90,39,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(45,90,39,0.15) 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            }}
          />

          {/* Snake body */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: segment.x * CELL_SIZE + 2,
                top: segment.y * CELL_SIZE + 2,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                backgroundColor: i === 0 ? '#7cb342' : '#4a7c59',
                border: '1px solid',
                borderColor: i === 0 ? '#8bc34a' : '#5a8c69',
                boxShadow: i === 0 ? '0 0 4px rgba(124,179,66,0.5)' : 'none',
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute"
            style={{
              left: food.x * CELL_SIZE + 2,
              top: food.y * CELL_SIZE + 2,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
              backgroundColor: '#c6a84b',
              border: '1px solid #d4b85b',
              boxShadow: '0 0 6px rgba(198,168,75,0.6)',
            }}
          />

          {/* Overlay messages */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-[#c0c0c0] win98-border-raised p-3 text-center">
                <div className="text-[14px] font-bold mb-1">GAME OVER</div>
                <div className="text-[11px]">Score: {score}</div>
                <button className="win98-btn text-[11px] mt-2" onClick={resetGame}>Play Again</button>
              </div>
            </div>
          )}

          {!running && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="bg-[#c0c0c0] win98-border-raised p-3 text-center">
                <div className="text-[13px] font-bold mb-1">SNAKE</div>
                <div className="text-[11px] mb-1">Arrow keys or WASD to move</div>
                <div className="text-[11px]">Press Start or Space</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
