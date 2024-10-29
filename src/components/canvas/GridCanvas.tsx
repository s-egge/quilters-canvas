import classes from './Canvas.module.css'
import { useRef, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { getMinimumShapeSize } from '@utils/mathTools'
import { drawShapeGrid } from '@utils/drawGridTools'
import { resizeCanvas } from '@utils/canvasTools'
import {
  setHeight,
  setWidth,
  setShapeSize,
  setShapes,
} from '@store/canvasSlice'
import { GridShape } from '@utils/interfaces'

export default function GridCanvas() {
  const dispatch = useAppDispatch()
  const canvasGridRef = useRef<HTMLCanvasElement>(null)
  const settings = useAppSelector((state) => state.canvas)

  function resizeCanvasBasedOnGridShapeAndSize(
    canvas: HTMLCanvasElement,
    gridShape: GridShape,
    gridHeight: number,
    gridWidth: number,
  ) {
    const shapeSize = getMinimumShapeSize(
      gridShape,
      gridWidth,
      gridHeight,
      canvas.width,
      canvas.height,
    )

    dispatch(setShapeSize(shapeSize))
    dispatch(setHeight(gridHeight * shapeSize))
    dispatch(setWidth(gridWidth * shapeSize))

    resizeCanvas(canvas, gridHeight * shapeSize, gridWidth * shapeSize)

    const newShapes = drawShapeGrid(canvas, gridShape, shapeSize, '#000000')
    dispatch(setShapes(newShapes))
  }

  //
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
    )
  }, [settings.gridHeight, settings.gridWidth, settings.gridShape])

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
    )
  }, [])

  return <canvas ref={canvasGridRef} className={classes.canvasGrid} />
}
