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
      if (shape.fill.type === 'color') {
        drawShape(c, shape.type, shape.x, shape.y, shapeSize, shape.fill)

        continue
      }
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
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toolbar = useAppSelector((state) => state.toolbar)
  const palette = useAppSelector((state) => state.palette)
  const settings = useAppSelector((state) => state.canvas)
  const [mouseDown, setMouseDown] = useState(false)
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined)
  const [lastFilledShape, setlastFilledShape] = useState<Shape | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(1)

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

  // zoom canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    canvas.style.transform = `scale(${zoom})`
    canvas.style.transformOrigin = '0 0'

    // target the div nested in the viewport in the containerRef and change it's height/width
    const viewport = containerRef.current.children[0]
      .children[0] as HTMLDivElement
    console.log('viewport')
    console.log(viewport)

    const canvasHeight = canvas.clientHeight * zoom
    const canvasWidth = canvas.clientWidth * zoom

    // set the height and width of the viewport to the height and width of the canvas
    if (zoom !== 1) {
      viewport.style.display = 'none'
      viewport.style.height = `${canvasHeight}px`
      viewport.style.width = `${canvasWidth}px`
      viewport.offsetHeight
      viewport.style.display = 'flex'
      containerRef.current.style.overflow = 'auto'
    }
  }, [zoom])

  // load new pattern onto canvas
  useEffect(() => {
    if (!settings.loadPattern) return
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Error: Could not get canvas while loading pattern')
      return
    }
    setZoom(1)

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
  }, [settings.loadPattern, settings.shapes, settings.shapeSize])

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
    setZoom(1)
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
    if (e.button === 1 || e.button === 2) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const rect = canvasRef.current.getBoundingClientRect()
    let x = (e.clientX - rect.left) / zoom
    let y = (e.clientY - rect.top) / zoom

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
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1) return
    setMouseDown(true)
  }

  const handleMouseWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !containerRef.current) return
    if (toolbar.zoom) {
      e.preventDefault()
      e.stopPropagation()

      const canvasWidth = canvasRef.current.clientWidth * zoom
      const canvasHeight = canvasRef.current.clientHeight * zoom
      const viewportWidth = containerRef.current.clientWidth
      const viewportHeight = containerRef.current.clientHeight

      if (e.deltaY < 0) {
        if (zoom >= 2) return
        setZoom((prevZoom) => prevZoom + 0.1)
      } else {
        // stop zooming when full canvas is visible
        if (canvasWidth < viewportWidth && canvasHeight < viewportHeight) return
        setZoom((prevZoom) => prevZoom - 0.1)
      }
    }
  }

  return (
    <ScrollArea
      ref={containerRef}
      scrollbarSize={20}
      type="always"
      classNames={{
        root: classes.canvasContainer,
        viewport: classes.viewport,
      }}
    >
      <GridCanvas
        maxHeight={containerRef.current?.clientHeight}
        maxWidth={containerRef.current?.clientWidth}
        zoom={zoom}
      />
      <canvas
        ref={canvasRef}
        className={classes.canvas}
        onClick={handleMouseClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setMouseDown(false)}
        onWheel={handleMouseWheel}
      />
      {loading && (
        <Loader
          id="loader"
          style={{
            position: 'absolute',
            top: `${window.innerHeight / 4}px`,
            left: `${window.innerWidth / 4}px`,
            zIndex: 100,
          }}
          size={
            (window.innerWidth < window.innerHeight
              ? window.innerWidth
              : window.innerHeight) / 2
          }
        />
      )}
    </ScrollArea>
  )
}
