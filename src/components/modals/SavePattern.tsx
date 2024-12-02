import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { toggleTool } from '@store/toolbarSlice'
import {
  Modal,
  Button,
  Flex,
  Text,
  Divider,
  TextInput,
  Textarea,
  Accordion,
  HoverCard,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import BrowserPatternItem from './ui/BrowserPatternItem'

const getSavedPattern = (number: number) =>
  JSON.parse(localStorage.getItem(`quiltersCanvasPattern${number}`) || 'null')

export default function SavePattern() {
  const dispatch = useAppDispatch()
  const showModal = useAppSelector((state) => state.toolbar.savePattern)
  const palette = useAppSelector((state) => state.palette)
  const canvas = useAppSelector((state) => state.canvas)
  const titlePlaceholder = canvas.title
    ? canvas.title
    : 'quiltersCanvasPattern' + Math.floor(Math.random() * 9999).toString()
  const descriptionPlaceholder = canvas.description
    ? canvas.description
    : '(Optional) Enter a description for your pattern'
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [savedPatterns, setSavedPatterns] = useState([
    getSavedPattern(1),
    getSavedPattern(2),
    getSavedPattern(3),
  ])

  if (!showModal) return null

  /*
    TODO: optimize saving patterns to browser. Using uploaded images takes way too much space,
    it's easy to reach the browser limit. Could potentially assign each palette swatch a 
    number/id when saving, and save that number in the canvas shapes instead of the url

    TODO: catch limit reached error when saving to browser and alert user they need to save
    to device instead

    TODO: make an interface for saved patterns to get rid of the any type
  */
  function handleSaveToBrowser(num: number) {
    const patternTitle = title || titlePlaceholder
    const patternDesc = description || ''
    const lastEditedDate = new Date().toLocaleString()
    const patternData = {
      lastEditedDate,
      palette,
      canvas: {
        ...canvas,
        title: patternTitle,
        description: patternDesc,
      },
    }

    localStorage.setItem(
      `quiltersCanvasPattern${num}`,
      JSON.stringify(patternData),
    )

    const updatedPatterns = [...savedPatterns]
    updatedPatterns[num - 1] = patternData
    setSavedPatterns(updatedPatterns)

    dispatch(toggleTool('savePattern'))
  }

  function handleDeleteFromBrowser(num: number) {
    localStorage.removeItem(`quiltersCanvasPattern${num}`)
    const updatedPatterns = [...savedPatterns]
    updatedPatterns[num - 1] = null
    setSavedPatterns(updatedPatterns)
  }

  function handleSaveToComputer() {
    const patternTitle = title || titlePlaceholder
    const patternDesc = description || ''
    const lastEditedDate = new Date().toLocaleString()
    const patternData = {
      lastEditedDate,
      palette,
      canvas: {
        ...canvas,
        title: patternTitle,
        description: patternDesc,
      },
    }

    patternData.canvas.title = patternTitle
    patternData.canvas.description = patternDesc

    const blob = new Blob([JSON.stringify(patternData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || titlePlaceholder}.qcp`
    link.click()
    URL.revokeObjectURL(url)

    dispatch(toggleTool('savePattern'))
  }

  function onClose() {
    dispatch(toggleTool('savePattern'))
    setTitle('')
    setDescription('')
  }

  return (
    <Modal
      opened={showModal}
      onClose={onClose}
      centered
      title="Save Pattern"
      size="md"
    >
      <TextInput
        label="Pattern Title"
        placeholder={titlePlaceholder}
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        mb="sm"
      ></TextInput>
      <Textarea
        label="Pattern Description"
        placeholder={descriptionPlaceholder}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        mb="sm"
      ></Textarea>
      <Divider />
      <Accordion defaultValue="Computer">
        <Accordion.Item key="save-to-browser" value="Browser">
          <Accordion.Control>
            <Flex direction="row" align="flex-end">
              <Text>Save in browser</Text>
              <HoverCard width={400} shadow="md">
                <HoverCard.Target>
                  <IconInfoCircle
                    style={{
                      marginLeft: 5,
                    }}
                    size={20}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text style={{ padding: 10 }}>
                    Saving in the browser will allow you to access your pattern
                    in this browser on this device only, and will be deleted if
                    you clear your browser cache. You can save up to three
                    patterns, but browsers have a limit on how much data they
                    can store, which may interfere with saving patterns with a
                    lot of imported images.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Flex>
          </Accordion.Control>
          <Accordion.Panel>
            {savedPatterns.map((pattern, index) => (
              <BrowserPatternItem
                key={index}
                pattern={pattern || {}}
                customButtonText="Save"
                onCustomButtonClick={() => handleSaveToBrowser(index + 1)}
                onDeletePattern={() => handleDeleteFromBrowser(index + 1)}
              />
            ))}
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="save-to-computer" value="Computer">
          <Accordion.Control>Save to computer</Accordion.Control>
          <Accordion.Panel>
            <Text style={{ padding: 10 }}>
              Saving to your computer will allow you to save the pattern to your
              device, where you can send it to other devices or save it to the
              cloud, and reupload it later.
            </Text>
            <Flex justify="flex-end">
              <Button onClick={handleSaveToComputer}>Save</Button>
            </Flex>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )
}
