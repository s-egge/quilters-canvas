import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { toggleTool } from '@store/toolbarSlice'
import { loadPalette } from '@store/paletteSlice'
import { loadCanvas } from '@store/canvasSlice'
import { PaletteState, CanvasState } from '@utils/interfaces'
import { Modal, Button, Accordion, Flex, FileInput } from '@mantine/core'
import BrowserPatternItem from './ui/BrowserPatternItem'

const getSavedPattern = (number: number) =>
  JSON.parse(localStorage.getItem(`quiltersCanvasPattern${number}`) || 'null')

export default function LoadPattern() {
  const dispatch = useAppDispatch()
  const showModal = useAppSelector((state) => state.toolbar.loadPattern)
  const [file, setFile] = useState<File | null>(null)

  const savedPatterns = showModal
    ? [getSavedPattern(1), getSavedPattern(2), getSavedPattern(3)]
    : []

  if (!showModal) return null

  function onClose() {
    setFile(null)
    dispatch(toggleTool('loadPattern'))
  }

  function handleLoadFromBrowser(num: number) {
    const patternData = savedPatterns[num - 1]
    if (!patternData) return

    dispatch(loadPalette(patternData.palette))
    dispatch(loadCanvas(patternData.canvas))

    dispatch(toggleTool('loadPattern'))
  }

  function handleLoadFromComputer() {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string)
        console.log('JSON data: ')
        console.log(jsonData)
        const palette = jsonData.palette as PaletteState
        const canvas = jsonData.canvas as CanvasState
        dispatch(loadPalette(palette))
        dispatch(loadCanvas(canvas))
      } catch (error) {
        console.error('Error loading file: ', error)
      }
    }

    reader.onerror = (error) => {
      console.error('Error loading file: ', error)
    }

    reader.readAsText(file as Blob)
    setFile(null)
    dispatch(toggleTool('loadPattern'))
  }

  return (
    <Modal
      opened={showModal}
      onClose={onClose}
      centered
      title="Load Pattern"
      size="md"
    >
      <Accordion defaultValue="Computer">
        <Accordion.Item key="browser" value="Browser">
          <Accordion.Control>Load from browser</Accordion.Control>
          <Accordion.Panel>
            {savedPatterns.map((pattern, index) => (
              <BrowserPatternItem
                key={index}
                pattern={pattern || {}}
                customButtonText="Load"
                onCustomButtonClick={() => handleLoadFromBrowser(index + 1)}
                onDeletePattern={() => console.log('delete')}
              />
            ))}
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="computer" value="Computer">
          <Accordion.Control>Load from computer</Accordion.Control>
          <Accordion.Panel>
            <FileInput
              mb="sm"
              value={file}
              onChange={setFile}
              accept={'.qcp'}
            />
            <Flex justify="flex-end">
              <Button disabled={!file} onClick={handleLoadFromComputer}>
                Load
              </Button>
            </Flex>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )
}
