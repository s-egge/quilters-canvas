import classes from './Canvas.module.css'
import { useRef, useEffect, useState } from 'react'
import GridCanvas from './GridCanvas'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { fillClosestShape, clearClosestShape } from '@utils/drawTools'
import { resizeCanvas } from '@utils/canvasTools'
import { ScrollArea } from '@mantine/core'
import { updateShape } from '@store/canvasSlice'

export default function Canvas() {
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toolbar = useAppSelector((state) => state.toolbar)
  const palette = useAppSelector((state) => state.palette)
  const settings = useAppSelector((state) => state.canvas)

  // resize canvas when settings change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    resizeCanvas(canvas, settings.height, settings.width)
  }, [settings.height, settings.width])

  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const rect = canvasRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    let shape

    if (toolbar.draw) {
      shape = fillClosestShape(
        ctx,
        settings.shapes,
        settings.gridShape,
        settings.gridWidth,
        settings.shapeSize,
        x,
        y,
        palette.currentSwatch,
      )
    } else if (toolbar.erase) {
      shape = clearClosestShape(
        ctx,
        settings.shapes,
        settings.gridShape,
        settings.gridWidth,
        settings.shapeSize,
        x,
        y,
      )
    }

    if (shape) dispatch(updateShape(shape))
  }

  return (
    <ScrollArea
      classNames={{
        root: classes.canvasContainer,
        viewport: classes.viewport,
      }}
    >
      <GridCanvas />
      <canvas
        ref={canvasRef}
        className={classes.canvas}
        onClick={handleMouseClick}
      />
    </ScrollArea>
  )
}
