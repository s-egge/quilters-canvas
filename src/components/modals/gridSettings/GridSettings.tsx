import { useAppDispatch, useAppSelector } from '@store/hooks'
import { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  Text,
  Divider,
  SegmentedControl,
  Space,
  SimpleGrid,
  NumberInput,
} from '@mantine/core'
import { IconHexagon, IconSquare } from '@tabler/icons-react'
import { toggleTool } from '@store/toolbarSlice'
import { GridShape } from '@utils/interfaces'
import { setGridShape, setGridHeight, setGridWidth } from '@store/canvasSlice'

export default function GridSettings() {
  const dispatch = useAppDispatch()
  const modalOpen = useAppSelector((state) => state.toolbar.gridSettings)
  const canvasSettings = useAppSelector((state) => state.canvas)
  // settings
  const [shape, setShape] = useState<GridShape>(canvasSettings.gridShape)
  const [height, setHeight] = useState(canvasSettings.gridHeight)
  const [width, setWidth] = useState(canvasSettings.gridWidth)
  const [gridResetWarning, setGridResetWarning] = useState(false)

  // give a warning if shape/height/width change
  useEffect(() => {
    if (
      shape !== canvasSettings.gridShape ||
      height !== canvasSettings.gridHeight ||
      width !== canvasSettings.gridWidth
    ) {
      setGridResetWarning(true)
    } else {
      setGridResetWarning(false)
    }
  }, [shape, height, width])

  if (!modalOpen) return null

  function handleSave() {
    dispatch(setGridShape(shape))
    dispatch(setGridHeight(height))
    dispatch(setGridWidth(width))
    setGridResetWarning(false)
    dispatch(toggleTool('gridSettings'))
  }

  function onClose() {
    dispatch(toggleTool('gridSettings'))
    setShape(canvasSettings.gridShape)
    setHeight(canvasSettings.gridHeight)
    setWidth(canvasSettings.gridWidth)
    setGridResetWarning(false)
  }

  return (
    <Modal title="Grid Settings" opened={modalOpen} onClose={onClose}>
      <Divider mb="sm" />
      <Text>Grid Shape</Text>
      <Space h="sm" />
      <SegmentedControl
        defaultValue={shape}
        onChange={(value) => setShape(value as GridShape)}
        data={[
          {
            value: 'hexagon',
            label: <IconHexagon style={{ transform: 'rotate(90deg)' }} />,
          },
          {
            value: 'square',
            label: <IconSquare />,
          },
        ]}
      />
      <Divider mt="sm" mb="sm" />

      <Text>Grid Size</Text>
      <SimpleGrid cols={2}>
        <NumberInput
          label="Height"
          min={4}
          max={100}
          value={height}
          onChange={(value) => setHeight(value as number)}
        />
        <NumberInput
          label="Width"
          min={4}
          max={100}
          value={width}
          onChange={(value) => setWidth(value as number)}
        />
      </SimpleGrid>
      {gridResetWarning ? (
        <>
          <Text c="red" size="s">
            Warning! Changing the grid size or shape may alter your pattern in
            unintended ways.
          </Text>

          <Button mt="sm" color="red" onClick={handleSave}>
            Save Settings
          </Button>
        </>
      ) : (
        <>
          <Button mt="sm" onClick={handleSave}>
            Save
          </Button>
        </>
      )}
    </Modal>
  )
}
