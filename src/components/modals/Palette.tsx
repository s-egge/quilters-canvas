import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { toggleTool } from '../../store/toolbarSlice'
import { Modal, Accordion, Text } from '@mantine/core'

export default function Palette() {
  const dispatch = useAppDispatch()
  const paletteOn = useAppSelector((state) => state.toolbar.palette)

  console.log('paletteOn: ', paletteOn)

  if (!paletteOn) return null

  return (
    <Modal
      opened={paletteOn}
      onClose={() => dispatch(toggleTool('palette'))}
      title="Pattern Palette"
      centered
    >
      <Accordion defaultValue="Saved Fills">
        <Accordion.Item key="saved-fills" value="Saved Fills">
          <Accordion.Control>Saved Fills</Accordion.Control>
          <Accordion.Panel>
            <Text c="green">
              TODO: Previously used colors/fills will go here
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="add-fill-color" value="Add Fill Color">
          <Accordion.Control>Add Solid Color</Accordion.Control>
          <Accordion.Panel>
            <Text c="green">TODO: Add a hex/rgb color</Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="add-url-image" value="Add URL Image">
          <Accordion.Control>Add Image From URL</Accordion.Control>
          <Accordion.Panel>
            <Text c="green">TODO: Add an image via URL</Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="upload-image" value="Upload Image">
          <Accordion.Control>Upload Image</Accordion.Control>
          <Accordion.Panel>
            <Text c="green">TODO: Add an image from computer</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )
}
