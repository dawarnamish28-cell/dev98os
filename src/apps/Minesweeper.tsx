import React, { useState, useCallback } from 'react';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].adjacent = count;
    }
  }

  return board;
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map(row => row.map(cell => ({ ...cell })));
}

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [faceState, setFaceState] = useState<'smile' | 'wow' | 'dead' | 'cool'>('smile');
  const [mineCount, setMineCount] = useState(MINES);
  const [time, setTime] = useState(0);
  const [timerRef, setTimerRef] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const startTimer = useCallback(() => {
    if (timerRef) return;
    const ref = window.setInterval(() => {
      setTime(t => Math.min(t + 1, 999));
    }, 1000);
    setTimerRef(ref);
    setStarted(true);
  }, [timerRef]);

  const stopTimer = useCallback(() => {
    if (timerRef) {
      clearInterval(timerRef);
      setTimerRef(null);
    }
  }, [timerRef]);

  const resetGame = useCallback(() => {
    stopTimer();
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setFaceState('smile');
    setMineCount(MINES);
    setTime(0);
    setStarted(false);
  }, [stopTimer]);

  const reveal = useCallback((board: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (board[r][c].revealed || board[r][c].flagged) return;

    board[r][c].revealed = true;

    if (board[r][c].adjacent === 0 && !board[r][c].mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(board, r + dr, c + dc);
        }
      }
    }
  }, []);

  const checkWin = useCallback((board: Cell[][]): boolean => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c].mine && !board[r][c].revealed) return false;
      }
    }
    return true;
  }, []);

  const handleClick = useCallback((r: number, c: number) => {
    if (gameOver || won) return;
    if (board[r][c].flagged || board[r][c].revealed) return;

    if (!started) startTimer();

    const newBoard = cloneBoard(board);

    if (newBoard[r][c].mine) {
      newBoard[r][c].revealed = true;
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (newBoard[i][j].mine) newBoard[i][j].revealed = true;
        }
      }
      setBoard(newBoard);
      setGameOver(true);
      setFaceState('dead');
      stopTimer();
      return;
    }

    reveal(newBoard, r, c);

    if (checkWin(newBoard)) {
      setWon(true);
      setFaceState('cool');
      stopTimer();
    }

    setBoard(newBoard);
  }, [board, gameOver, won, started, startTimer, stopTimer, reveal, checkWin]);

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won) return;
    if (board[r][c].revealed) return;

    const newBoard = cloneBoard(board);
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
    setMineCount(prev => newBoard[r][c].flagged ? prev - 1 : prev + 1);
  }, [board, gameOver, won]);

  const numColors: Record<number, string> = {
    1: '#0000ff',
    2: '#008000',
    3: '#ff0000',
    4: '#000080',
    5: '#800000',
    6: '#008080',
    7: '#000000',
    8: '#808080',
  };

  const formatNum = (n: number) => String(Math.max(0, n)).padStart(3, '0');

  const getFace = () => {
    switch (faceState) {
      case 'smile': return ':|';
      case 'wow': return ':O';
      case 'dead': return 'X(';
      case 'cool': return 'B)';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2 items-center">
      {/* Menu bar */}
      <div className="flex text-[11px] mb-1 self-stretch">
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">Game</span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">Help</span>
      </div>

      {/* Game container */}
      <div className="win98-border-raised p-[6px] inline-block">
        {/* Header */}
        <div className="win98-border-sunken flex items-center justify-between p-1 mb-[6px]">
          {/* Mine counter */}
          <div className="bg-black text-red-500 font-mono text-[20px] px-1 leading-none w-[46px] text-center font-bold">
            {formatNum(mineCount)}
          </div>

          {/* Face button */}
          <button
            className="win98-btn w-[26px] h-[26px] min-w-0 p-0 text-[14px] font-mono leading-none flex items-center justify-center"
            onClick={resetGame}
          >
            {getFace()}
          </button>

          {/* Timer */}
          <div className="bg-black text-red-500 font-mono text-[20px] px-1 leading-none w-[46px] text-center font-bold">
            {formatNum(time)}
          </div>
        </div>

        {/* Board */}
        <div className="win98-border-sunken inline-block">
          {board.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  className={`w-[24px] h-[24px] text-[12px] font-bold flex items-center justify-center p-0 border-0 outline-none cursor-pointer ${
                    cell.revealed
                      ? 'bg-[#c0c0c0] border border-[#808080]'
                      : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]'
                  } ${cell.revealed && cell.mine && gameOver ? 'bg-red-400' : ''}`}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  onMouseDown={() => { if (!gameOver && !won) setFaceState('wow'); }}
                  onMouseUp={() => { if (!gameOver && !won) setFaceState('smile'); }}
                  onMouseLeave={() => { if (!gameOver && !won && faceState === 'wow') setFaceState('smile'); }}
                >
                  {cell.revealed ? (
                    cell.mine ? (
                      <span className="text-[14px]">*</span>
                    ) : cell.adjacent > 0 ? (
                      <span style={{ color: numColors[cell.adjacent] }}>{cell.adjacent}</span>
                    ) : null
                  ) : cell.flagged ? (
                    <span className="text-[12px] text-red-700">F</span>
                  ) : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mt-2 text-[11px] text-[#808080]">
        {gameOver ? 'Game Over! Click the face to restart.' :
         won ? 'You Win! All mines cleared!' :
         'Left click to reveal, right click to flag.'}
      </div>
    </div>
  );
}
