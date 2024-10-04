import classes from './GridCanvas.module.css'
import { useRef, useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'

export default function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toolbarState = useAppSelector((state) => state.toolbar)

  // set canvas size to css size to prevent blurry canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }, [])

  // temp draw/erase function
  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const side = canvas.width / 6

    if (toolbarState.draw) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x - side / 2, y - side / 2, side, side)
    } else if (toolbarState.erase) {
      ctx.clearRect(x - side / 2, y - side / 2, side, side)
    }
  }

  return (
    <div className={classes.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={classes.canvas}
        onClick={handleMouseClick}
      />
    </div>
  )
}
