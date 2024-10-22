import { useAppDispatch, useAppSelector } from '@store/hooks'
import { useState } from 'react'
import {
  Modal,
  Button,
  Text,
  Divider,
  SegmentedControl,
  Space,
} from '@mantine/core'
import { IconHexagon, IconSquare } from '@tabler/icons-react'
import { toggleTool } from '@store/toolbarSlice'
import { GridShape } from '@utils/interfaces'
import { setGridShape } from '@store/canvasSlice'

export default function GridSettings() {
  const dispatch = useAppDispatch()
  const modalOpen = useAppSelector((state) => state.toolbar.gridSettings)
  const canvasSettings = useAppSelector((state) => state.canvas)
  // settings
  const [shape, setShape] = useState<GridShape>(canvasSettings.gridShape)

  if (!modalOpen) return null

  function handleSave() {
    dispatch(setGridShape(shape))
    dispatch(toggleTool('gridSettings'))
  }

  function onClose() {
    dispatch(toggleTool('gridSettings'))
    setShape(canvasSettings.gridShape)
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
      <Button onClick={handleSave}>Save</Button>
    </Modal>
  )
}
