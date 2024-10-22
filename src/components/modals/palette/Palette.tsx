import { useAppSelector, useAppDispatch } from '@store/hooks.ts'
import SavedSwatches from './SavedSwatches'
import CurrentColor from './CurrentColor'
import AddPaletteColor from './AddPaletteColor'
import AddUrlImage from './AddUrlImage'
import UploadImage from './UploadImage'
import { toggleTool } from '@store/toolbarSlice.ts'
import { Modal, Accordion } from '@mantine/core'

export default function Palette() {
  const dispatch = useAppDispatch()
  const paletteOn = useAppSelector((state) => state.toolbar.palette)
  const palette = useAppSelector((state) => state.palette)

  if (!paletteOn) return null

  return (
    <Modal
      opened={paletteOn}
      onClose={() => dispatch(toggleTool('palette'))}
      title="Pattern Palette"
      centered
    >
      <CurrentColor currentSwatch={palette.currentSwatch} />

      <Accordion defaultValue="Saved Swatches">
        <Accordion.Item key="saved-swatchess" value="Saved Swatches">
          <Accordion.Control>Saved Swatches</Accordion.Control>
          <Accordion.Panel>
            <SavedSwatches
              savedSwatches={palette.savedSwatches}
              currentSwatch={palette.currentSwatch}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="add-swatch-color" value="Add Swatch Color">
          <Accordion.Control>Add Solid Color</Accordion.Control>
          <Accordion.Panel>
            <AddPaletteColor currentColor={palette.currentSwatch.color} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="add-url-image" value="Add URL Image">
          <Accordion.Control>Add Image From URL</Accordion.Control>
          <Accordion.Panel>
            <AddUrlImage />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="upload-image" value="Upload Image">
          <Accordion.Control>Upload Image</Accordion.Control>
          <Accordion.Panel>
            <UploadImage />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )
}
