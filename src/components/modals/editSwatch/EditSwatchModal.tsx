import { useAppDispatch, useAppSelector } from '@store/hooks'
import { useRef, useEffect, useState } from 'react'
import { Modal, Button, Slider, Divider, Text, Group } from '@mantine/core'
import { GridShape } from '@utils/interfaces'
import { setSwatch, toggleSwatchScaleChange } from '@store/paletteSlice'
import classes from './EditSwatchModal.module.css'
import { drawShapeOutline } from '@utils/drawGridTools'
import { drawShape } from '@utils/drawTools'
import { toggleTool } from '@store/toolbarSlice'

function getShapeSize(c: HTMLCanvasElement, shape: string): number {
  if (shape === GridShape.Hexagon) {
    return c.clientWidth / 2
  }

  // square
  return c.clientWidth * 0.9
}

function getXY(c: HTMLCanvasElement, shape: string): { x: number; y: number } {
  if (shape === GridShape.Hexagon) {
    return { x: c.clientWidth / 2, y: c.clientHeight / 2 }
  }

  // square
  return { x: c.clientWidth * 0.05, y: c.clientHeight * 0.05 }
}

export default function EditPatternModal() {
  const dispatch = useAppDispatch()
  const modalOpen = useAppSelector((state) => state.toolbar.editSwatch)
  const canvasSettings = useAppSelector((state) => state.canvas)
  const swatch = useAppSelector((state) => state.palette.currentSwatch)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasGridRef = useRef<HTMLCanvasElement>(null)
  const [imgScale, setImgScale] = useState(swatch.scale)

  useEffect(() => {
    setImgScale(swatch.scale)
  }, [swatch])

  useEffect(() => {
    if (!modalOpen) return

    window.requestAnimationFrame(() => {
      const canvas = canvasRef.current
      const canvasGrid = canvasGridRef.current
      const gridC = canvasGrid?.getContext('2d')
      const canvasC = canvas?.getContext('2d')

      if (!canvas || !canvasGrid || !gridC || !canvasC) {
        console.log('Error: something went wrong with the canvas')
        return
      }

      // prevents the canvas from being blurry due to originally sizing with css
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      canvasGrid.width = canvasGrid.clientWidth
      canvasGrid.height = canvasGrid.clientHeight

      const shapeSize = getShapeSize(canvasGrid, canvasSettings.gridShape)
      const { x, y } = getXY(canvasGrid, canvasSettings.gridShape)

      drawShapeOutline(
        gridC,
        canvasSettings.gridShape,
        x,
        y,
        shapeSize,
        '#000000',
      )

      drawShape(canvasC, canvasSettings.gridShape, x, y, shapeSize, {
        ...swatch,
        scale: imgScale,
      })
    })
  }, [modalOpen, canvasSettings.shapeSize, imgScale])

  const handleClose = () => {
    dispatch(toggleTool('editSwatch'))
    setImgScale(swatch.scale)
    dispatch(toggleTool('palette'))
  }

  const handleSave = () => {
    dispatch(toggleTool('editSwatch'))
    if (swatch.scale !== imgScale) {
      dispatch(setSwatch({ ...swatch, scale: imgScale }))
      dispatch(toggleSwatchScaleChange(true))
    }
    //dispatch(toggleTool('palette'))
  }

  return (
    <Modal
      title="Edit Pattern"
      opened={modalOpen}
      onClose={handleClose}
      size="xl"
    >
      <Group>
        <Text fw={500} size="lg">
          Scale
        </Text>
        <Text c="dimmed">Move the slider to adjust the scale of the image</Text>
      </Group>
      <Slider
        defaultValue={imgScale}
        min={0.1}
        max={1}
        step={0.05}
        onChange={(value) => setImgScale(value)}
      />
      <div className={classes.canvasContainer}>
        <canvas ref={canvasGridRef} className={classes.canvasGrid}></canvas>
        <canvas ref={canvasRef} className={classes.canvas}></canvas>
      </div>
      <Divider />
      <Button onClick={handleSave}>Save</Button>
    </Modal>
  )
}
