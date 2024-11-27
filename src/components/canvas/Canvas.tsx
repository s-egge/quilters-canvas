import classes from './Canvas.module.css'
import { useRef, useEffect, useState } from 'react'
import GridCanvas from './GridCanvas'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { Shape } from '@utils/interfaces'
import {
  fillClosestShape,
  clearClosestShape,
  drawShape,
} from '@utils/drawTools'
import { findClosestShape } from '@utils/mathTools'
import { shapeContainsSwatch } from '@utils/miscTools'
import { resizeCanvas } from '@utils/canvasTools'
import { ScrollArea, Loader } from '@mantine/core'
import { updateShape, setClearCanvas, setLoadPattern } from '@store/canvasSlice'
import { toggleSwatchScaleChange } from '@store/paletteSlice'

async function drawPatternShapesOnCanvas(
  canvas: HTMLCanvasElement,
  shapes: Shape[],
  shapeSize: number,
) {
  const c = canvas.getContext('2d')

  if (!c) {
    console.error('Could not get canvas context')
    return
  }

  for (const shape of shapes) {
    if (shape.fill) {
      const img = new Image()
      img.src = shape.fill.url as string

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          if (shape.fill) {
            drawShape(
              c,
              shape.type,
              shape.x,
              shape.y,
              shapeSize,
              shape.fill,
              img,
            )
          }
          resolve()
        }
        img.onerror = reject
      })
    }
  }
}

export default function Canvas() {
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toolbar = useAppSelector((state) => state.toolbar)
  const palette = useAppSelector((state) => state.palette)
  const settings = useAppSelector((state) => state.canvas)
  const [mouseDown, setMouseDown] = useState(false)
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined)
  const [lastFilledShape, setlastFilledShape] = useState<Shape | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const c = canvas?.getContext('2d')
    if (!c || !canvas) {
      console.error('Error: Could not get canvas while clearing')
      return
    }
    c.clearRect(0, 0, canvas.width, canvas.height)
    dispatch(setClearCanvas(false))
  }

  // load new pattern onto canvas
  useEffect(() => {
    if (!settings.loadPattern) return
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Error: Could not get canvas while loading pattern')
      return
    }

    const drawData = async () => {
      setLoading(true)
      await drawPatternShapesOnCanvas(
        canvas,
        settings.shapes,
        settings.shapeSize,
      )
      setLoading(false)
      dispatch(setLoadPattern(false))
    }
    drawData().catch(console.error)
  }, [settings.loadPattern, settings.shapes])

  // clear canvas
  useEffect(() => {
    clearCanvas()
  }, [settings.clearCanvas])

  // load image when swatch changes to improve performance
  useEffect(() => {
    if (palette.currentSwatch.url) {
      const img = new Image()
      img.src = palette.currentSwatch.url
      img.onload = () => setImg(img)
    }
    setImg(undefined)
  }, [palette.currentSwatch.url])

  // resize canvas when settings change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    resizeCanvas(canvas, settings.height, settings.width)
  }, [settings.height, settings.width])

  // update canvas when swatch scale changes
  useEffect(() => {
    const canvas = canvasRef.current
    const c = canvas?.getContext('2d')

    if (!canvas || !c) {
      console.error('Error: Could not get canvas')
      return
    }

    if (!palette.currentSwatch.url) {
      console.error('Error: No URL for current swatch')
      return
    }

    const img = new Image()
    img.src = palette.currentSwatch.url
    img.onload = () => {
      const shapes = settings.shapes
      shapes.forEach((shape) => {
        if (shapeContainsSwatch(shape, palette.currentSwatch)) {
          drawShape(
            c,
            settings.gridShape,
            shape.x,
            shape.y,
            settings.shapeSize,
            palette.currentSwatch,
            img,
          )
          dispatch(updateShape({ ...shape, fill: palette.currentSwatch }))
        }
      })
    }

    dispatch(toggleSwatchScaleChange(false))
  }, [palette.swatchScaleChange])

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
        img,
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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseDown) return
    const canvas = canvasRef.current
    const c = canvas?.getContext('2d') as CanvasRenderingContext2D

    if (!c || !canvas) {
      console.error('Error: Could not get canvas')
      return
    }

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let shape = findClosestShape(
      x,
      y,
      settings.gridShape,
      settings.gridWidth,
      settings.shapeSize,
      settings.shapes,
    )

    // fill or erase if moused over a new shape
    if (
      shape &&
      (shape.x !== lastFilledShape?.x || shape.y !== lastFilledShape?.y)
    ) {
      if (toolbar.draw) {
        shape = fillClosestShape(
          c,
          settings.shapes,
          settings.gridShape,
          settings.gridWidth,
          settings.shapeSize,
          x,
          y,
          palette.currentSwatch,
          img,
        )
      } else if (toolbar.erase) {
        shape = clearClosestShape(
          c,
          settings.shapes,
          settings.gridShape,
          settings.gridWidth,
          settings.shapeSize,
          x,
          y,
        )
      }

      if (shape) {
        setlastFilledShape(shape)
        dispatch(updateShape(shape))
      }
    }
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
        onMouseMove={handleMouseMove}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      />
      {loading && (
        <Loader
          id="loader"
          style={{
            position: 'absolute',
            top: canvasRef.current
              ? `${canvasRef.current.clientHeight / 4}px`
              : '0',
            left: canvasRef.current
              ? `${canvasRef.current.clientWidth / 4}px`
              : '0',
            zIndex: 100,
          }}
          size={
            canvasRef.current?.clientWidth
              ? canvasRef.current.clientWidth / 2
              : window.innerWidth / 4
          }
        />
      )}
    </ScrollArea>
  )
}
