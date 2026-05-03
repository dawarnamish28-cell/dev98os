import React, { useState } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [fresh, setFresh] = useState(true)

  const handleNumber = (n: string) => {
    if (fresh) {
      setDisplay(n)
      setFresh(false)
    } else {
      setDisplay(display === '0' && n !== '.' ? n : display + n)
    }
  }

  const handleOp = (newOp: string) => {
    const current = parseFloat(display)

    if (prev !== null && op && !fresh) {
      const result = calculate(prev, current, op)
      setDisplay(String(result))
      setPrev(result)
    } else {
      setPrev(current)
    }

    setOp(newOp)
    setFresh(true)
  }

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b !== 0 ? a / b : 0
      default: return b
    }
  }

  const handleEquals = () => {
    if (prev !== null && op) {
      const current = parseFloat(display)
      const result = calculate(prev, current, op)
      setDisplay(String(result))
      setPrev(null)
      setOp(null)
      setFresh(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setFresh(true)
  }

  const handleClearEntry = () => {
    setDisplay('0')
    setFresh(true)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const handlePlusMinus = () => {
    setDisplay(String(-parseFloat(display)))
  }

  const handlePercent = () => {
    if (prev !== null) {
      setDisplay(String((prev * parseFloat(display)) / 100))
    } else {
      setDisplay(String(parseFloat(display) / 100))
    }
  }

  const handleSqrt = () => {
    const val = parseFloat(display)
    if (val >= 0) {
      setDisplay(String(Math.sqrt(val)))
    }
    setFresh(true)
  }

  const handleInverse = () => {
    const val = parseFloat(display)
    if (val !== 0) {
      setDisplay(String(1 / val))
    }
    setFresh(true)
  }

  const btnClass = "win98-btn text-[12px] h-[26px] min-w-0 flex-1"
  const btnRedClass = "win98-btn text-[12px] h-[26px] min-w-0 flex-1 text-red-700"
  const btnBlueClass = "win98-btn text-[12px] h-[26px] min-w-0 flex-1 text-blue-800"

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2">

      <div className="flex text-[11px] mb-1">
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">Edit</span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">View</span>
        <span className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer">Help</span>
      </div>

      <div className="win98-border-field bg-white text-right px-2 py-1 mb-2 text-[16px] font-mono h-[28px] flex items-center justify-end overflow-hidden">
        {display}
      </div>

      <div className="flex flex-col gap-[3px]">

        <div className="flex gap-[3px]">
          <button className={btnRedClass} onClick={() => { setDisplay('0'); setFresh(true) }}>MC</button>
          <button className={btnRedClass} onClick={handleBackspace}>Bk</button>
          <button className={btnRedClass} onClick={handleClearEntry}>CE</button>
          <button className={btnRedClass} onClick={handleClear}>C</button>
        </div>

        <div className="flex gap-[3px]">
          <button className={btnClass} onClick={() => handleNumber('7')}>7</button>
          <button className={btnClass} onClick={() => handleNumber('8')}>8</button>
          <button className={btnClass} onClick={() => handleNumber('9')}>9</button>
          <button className={btnBlueClass} onClick={() => handleOp('/')}>/</button>
          <button className={btnBlueClass} onClick={handleSqrt}>sqrt</button>
        </div>

        <div className="flex gap-[3px]">
          <button className={btnClass} onClick={() => handleNumber('4')}>4</button>
          <button className={btnClass} onClick={() => handleNumber('5')}>5</button>
          <button className={btnClass} onClick={() => handleNumber('6')}>6</button>
          <button className={btnBlueClass} onClick={() => handleOp('*')}>*</button>
          <button className={btnBlueClass} onClick={handlePercent}>%</button>
        </div>

        <div className="flex gap-[3px]">
          <button className={btnClass} onClick={() => handleNumber('1')}>1</button>
          <button className={btnClass} onClick={() => handleNumber('2')}>2</button>
          <button className={btnClass} onClick={() => handleNumber('3')}>3</button>
          <button className={btnBlueClass} onClick={() => handleOp('-')}>-</button>
          <button className={btnBlueClass} onClick={handleInverse}>1/x</button>
        </div>

        <div className="flex gap-[3px]">
          <button className={btnClass} onClick={() => handleNumber('0')}>0</button>
          <button className={btnClass} onClick={handlePlusMinus}>+/-</button>
          <button className={btnClass} onClick={() => handleNumber('.')}>.</button>
          <button className={btnBlueClass} onClick={() => handleOp('+')}>+</button>
          <button className={btnBlueClass} onClick={handleEquals}>=</button>
        </div>

      </div>
    </div>
  )
}
