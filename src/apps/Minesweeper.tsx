import React, { useState, useCallback } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0
    }))
  )

  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)

    if (!board[r][c].mine) {
      board[r][c].mine = true
      placed++
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue

      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc

          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) {
            count++
          }
        }
      }

      board[r][c].adjacent = count
    }
  }

  return board
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map(row => row.map(cell => ({ ...cell })))
}

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>(createBoard)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [face, setFace] = useState<'smile' | 'wow' | 'dead' | 'cool'>('smile')
  const [minesLeft, setMinesLeft] = useState(MINES)
  const [time, setTime] = useState(0)
  const [timer, setTimer] = useState<number | null>(null)
  const [started, setStarted] = useState(false)

  const startTimer = useCallback(() => {
    if (timer) return
    const t = window.setInterval(() => {
      setTime(v => (v < 999 ? v + 1 : v))
    }, 1000)
    setTimer(t)
    setStarted(true)
  }, [timer])

  const stopTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer)
      setTimer(null)
    }
  }, [timer])

  const resetGame = useCallback(() => {
    stopTimer()
    setGrid(createBoard())
    setGameOver(false)
    setWon(false)
    setFace('smile')
    setMinesLeft(MINES)
    setTime(0)
    setStarted(false)
  }, [stopTimer])

  const reveal = (b: Cell[][], r: number, c: number) => {
    if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return
    if (b[r][c].revealed || b[r][c].flagged) return

    b[r][c].revealed = true

    if (!b[r][c].mine && b[r][c].adjacent === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(b, r + dr, c + dc)
        }
      }
    }
  }

  const checkWin = (b: Cell[][]) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!b[r][c].mine && !b[r][c].revealed) return false
      }
    }
    return true
  }

  const handleClick = useCallback((r: number, c: number) => {
    if (gameOver || won) return
    if (grid[r][c].flagged || grid[r][c].revealed) return

    if (!started) startTimer()

    const newGrid = cloneBoard(grid)

    if (newGrid[r][c].mine) {
      newGrid[r][c].revealed = true

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (newGrid[i][j].mine) newGrid[i][j].revealed = true
        }
      }

      setGrid(newGrid)
      setGameOver(true)
      setFace('dead')
      stopTimer()
      return
    }

    reveal(newGrid, r, c)

    if (checkWin(newGrid)) {
      setWon(true)
      setFace('cool')
      stopTimer()
    }

    setGrid(newGrid)
  }, [grid, gameOver, won, started, startTimer, stopTimer])

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault()
    if (gameOver || won) return
    if (grid[r][c].revealed) return

    const newGrid = cloneBoard(grid)
    newGrid[r][c].flagged = !newGrid[r][c].flagged

    setGrid(newGrid)
    setMinesLeft(v => (newGrid[r][c].flagged ? v - 1 : v + 1))
  }, [grid, gameOver, won])

  const colors: Record<number, string> = {
    1: '#0000ff',
    2: '#008000',
    3: '#ff0000',
    4: '#000080',
    5: '#800000',
    6: '#008080',
    7: '#000000',
    8: '#808080'
  }

  const pad = (n: number) => String(Math.max(0, n)).padStart(3, '0')

  const faceIcon = () => {
    if (face === 'dead') return 'X('
    if (face === 'cool') return 'B)'
    if (face === 'wow') return ':O'
    return ':|'
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2 items-center">

      <div className="flex text-[11px] mb-1 self-stretch">
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">Game</span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">Help</span>
      </div>

      <div className="win98-border-raised p-[6px] inline-block">

        <div className="win98-border-sunken flex items-center justify-between p-1 mb-[6px]">
          <div className="bg-black text-red-500 font-mono text-[20px] px-1 w-[46px] text-center font-bold">
            {pad(minesLeft)}
          </div>

          <button
            className="win98-btn w-[26px] h-[26px] text-[14px] font-mono flex items-center justify-center"
            onClick={resetGame}
          >
            {faceIcon()}
          </button>

          <div className="bg-black text-red-500 font-mono text-[20px] px-1 w-[46px] text-center font-bold">
            {pad(time)}
          </div>
        </div>

        <div className="win98-border-sunken inline-block">
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <button
                  key={r + '-' + c}
                  className={`w-[24px] h-[24px] text-[12px] font-bold flex items-center justify-center p-0 ${
                    cell.revealed
                      ? 'bg-[#c0c0c0] border border-[#808080]'
                      : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]'
                  } ${cell.revealed && cell.mine && gameOver ? 'bg-red-400' : ''}`}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={e => handleRightClick(e, r, c)}
                  onMouseDown={() => !gameOver && !won && setFace('wow')}
                  onMouseUp={() => !gameOver && !won && setFace('smile')}
                  onMouseLeave={() => face === 'wow' && setFace('smile')}
                >
                  {cell.revealed
                    ? cell.mine
                      ? '*'
                      : cell.adjacent > 0
                        ? <span style={{ color: colors[cell.adjacent] }}>{cell.adjacent}</span>
                        : null
                    : cell.flagged
                      ? <span className="text-red-700">F</span>
                      : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-[#808080]">
        {gameOver
          ? 'Game Over! Click the face to restart.'
          : won
            ? 'You Win! All mines cleared!'
            : 'Left click to reveal, right click to flag.'}
      </div>
    </div>
  )
}
