import classes from './GridCanvas.module.css'
import { useRef, useEffect } from 'react'
import { useAppSelector } from '@store/hooks'
import { drawShape } from '@utils/drawTools'
import { GridShape } from '@utils/interfaces'

export default function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toolbar = useAppSelector((state) => state.toolbar)
  const palette = useAppSelector((state) => state.palette)
  const settings = useAppSelector((state) => state.canvas)

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
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    const side = canvas.width / 10

    // adjust square x/y to center
    if (settings.gridShape === GridShape.Square) {
      x -= side / 2
      y -= side / 2
    }

    if (toolbar.draw) {
      if (palette.currentSwatch.color) {
        drawShape(
          ctx,
          settings.gridShape,
          x,
          y,
          side,
          palette.currentSwatch.color,
        )
      } else if (palette.currentSwatch.url) {
        const img = new Image()
        img.src = palette.currentSwatch.url
        img.onload = () => {
          drawShape(ctx, settings.gridShape, x, y, side, '#000', img)
        }
      }
    } else if (toolbar.erase) {
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
