import classes from './Canvas.module.css'
import { useRef, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { getMinimumShapeSize } from '@utils/mathTools'
import { resizeShapesArray } from '@utils/miscTools'
import { drawShapeGrid } from '@utils/drawGridTools'
import { resizeCanvas } from '@utils/canvasTools'
import {
  setHeight,
  setWidth,
  setShapeSize,
  setShapes,
  setLoadPattern,
} from '@store/canvasSlice'
import { GridShape } from '@utils/interfaces'

export default function GridCanvas({
  maxHeight,
  maxWidth,
}: {
  maxHeight?: number
  maxWidth?: number
}) {
  const dispatch = useAppDispatch()
  const canvasGridRef = useRef<HTMLCanvasElement>(null)
  const settings = useAppSelector((state) => state.canvas)

  function resizeCanvasBasedOnGridShapeAndSize(
    canvas: HTMLCanvasElement,
    gridShape: GridShape,
    gridHeight: number,
    gridWidth: number,
    initialRender: boolean = false,
  ) {
    // first reset the canvas to take up as much space as it can based on max height and width if available
    canvas.style.height = maxHeight ? `${maxHeight}px` : '95%'
    canvas.style.width = maxWidth ? `${maxWidth}px` : '95%'
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const shapeSize = getMinimumShapeSize(
      gridShape,
      gridWidth,
      gridHeight,
      canvas.width,
      canvas.height,
    )

    dispatch(setShapeSize(shapeSize))

    let height = 0
    let width = 0

    dispatch(setHeight(gridHeight * shapeSize))
    dispatch(setWidth(gridWidth * shapeSize))

    if (settings.gridShape === GridShape.Square) {
      height = gridHeight * shapeSize
      width = gridWidth * shapeSize
    } else {
      const hexWidth = 2 * shapeSize
      const hexWidthOffset = hexWidth - shapeSize * Math.cos(Math.PI / 3)

      // after the first hexagon horizontially, every hexagon ends after a hexWidthOffset width
      width = hexWidth + (gridWidth - 1) * hexWidthOffset

      // height of one hexagon is 2 * r * sin(60deg)
      const hexHeight = 2 * shapeSize * Math.sin(Math.PI / 3)
      // height is number of hexagons, plus a little over half a hexagon for buffer and offset
      const hexOffsetAndBuffer = hexHeight * 0.65
      height = gridHeight * hexHeight + hexOffsetAndBuffer
    }

    resizeCanvas(canvas, height, width)
    dispatch(setHeight(height))
    dispatch(setWidth(width))

    let newShapes = drawShapeGrid(
      canvas,
      gridShape,
      shapeSize,
      settings.gridColor,
    )

    if (newShapes) {
      newShapes = resizeShapesArray(settings.shapes, newShapes)
      dispatch(setShapes(newShapes))
      if (!initialRender) dispatch(setLoadPattern(true))
    } else {
      console.error('Error: Could not draw shape grid')
    }
  }

  // handle loading an existing pattern
  useEffect(() => {
    const canvas = canvasGridRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    resizeCanvas(canvas, settings.height, settings.width)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawShapeGrid(
      canvas,
      settings.gridShape,
      settings.shapeSize,
      settings.gridColor,
    )
  }, [settings.loadPattern])

  // resize canvas when grid shape or size changes
  useEffect(() => {
    const canvas = canvasGridRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas || settings.loadPattern) return

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    resizeCanvasBasedOnGridShapeAndSize(
      canvas,
      settings.gridShape,
      settings.gridHeight,
      settings.gridWidth,
    )
  }, [settings.gridHeight, settings.gridWidth, settings.gridShape])

  // redraw grid when grid color changes
  useEffect(() => {
    const canvas = canvasGridRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    drawShapeGrid(
      canvas,
      settings.gridShape,
      settings.shapeSize,
      settings.gridColor,
    )
  }, [settings.gridColor])

  // set up grid and shapes on initial render
  useEffect(() => {
    const canvas = canvasGridRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    resizeCanvasBasedOnGridShapeAndSize(
      canvas,
      settings.gridShape,
      settings.gridHeight,
      settings.gridWidth,
      true,
    )
  }, [])

  return (
    <canvas
      style={{ visibility: settings.gridVisible ? 'visible' : 'hidden' }}
      ref={canvasGridRef}
      className={classes.canvasGrid}
    />
  )
}
