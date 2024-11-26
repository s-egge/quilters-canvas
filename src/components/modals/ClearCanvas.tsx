import { useAppDispatch, useAppSelector } from '@store/hooks'
import { toggleTool } from '@store/toolbarSlice'
import { setClearCanvas } from '@store/canvasSlice'
import { Modal, Button, Group, Text } from '@mantine/core'

export default function ClearCanvasModal() {
  const dispatch = useAppDispatch()
  const showModal = useAppSelector((state) => state.toolbar.clearAll)

  if (!showModal) return null

  function handleClearAll() {
    dispatch(setClearCanvas(true))
    dispatch(toggleTool('clearAll'))
  }

  return (
    <Modal
      opened={showModal}
      onClose={() => dispatch(toggleTool('clearAll'))}
      centered
      withCloseButton={false}
      size="auto"
    >
      <Text style={{ padding: 10 }} ta="center">
        Are you sure you want to completely erase the pattern?
      </Text>
      <Group justify="center" style={{ padding: 10 }}>
        <Button onClick={handleClearAll}>Yes</Button>
        <Button onClick={() => dispatch(toggleTool('clearAll'))}>No</Button>
      </Group>
    </Modal>
  )
}
