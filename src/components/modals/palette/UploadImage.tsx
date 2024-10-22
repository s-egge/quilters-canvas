import classes from './Palette.module.css'
import { useAppDispatch } from '@store/hooks'
import { useState } from 'react'
import { setSwatch } from '@store/paletteSlice'
import { IconUpload, IconPhoto, IconX, IconXboxX } from '@tabler/icons-react'
import {
  ScrollArea,
  Grid,
  Button,
  Group,
  Text,
  rem,
  CloseButton,
  Flex,
} from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { useForm } from '@mantine/form'

interface FormValues {
  files: File[]
}

// reference: https://help.mantine.dev/q/how-to-use-dropzone-with-form
export default function UploadImage() {
  const dispatch = useAppDispatch()
  const [imgPreviews, setImgPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: { files: [] },
  })

  const handleFiles = (files: File[]) => {
    setLoading(true)
    let filesProcessed = 0

    form.setFieldValue('files', files)
    const previews: string[] = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        previews.push(e.target?.result as string)
        filesProcessed++
        setImgPreviews([...previews])

        if (filesProcessed === files.length) {
          setLoading(false)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    const updatedFiles = form.values.files.filter((_, i) => i !== index)
    form.setFieldValue('files', updatedFiles)
    setImgPreviews(imgPreviews.filter((_, i) => i !== index))
  }

  const handleSaveImages = () => {
    setLoading(true)
    let filesProcessed = 0

    imgPreviews.forEach((preview) => {
      dispatch(setSwatch({ type: 'url', url: preview }))
      filesProcessed++

      if (filesProcessed === imgPreviews.length) {
        setImgPreviews([])
        form.setFieldValue('files', [])
        setLoading(false)
      }
    })
  }
  return (
    <>
      <Dropzone
        onDrop={handleFiles}
        loading={loading}
        onReject={() => form.setFieldError('files', 'Select images only')}
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
        className={classes.dropzone}
      >
        <Group
          justify="center"
          gap="sm"
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-blue-6)',
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)',
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-dimmed)',
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div style={{ width: '70%' }}>
            <Text size="xl" ta="center" inline>
              Drag images here or click to select files
            </Text>
          </div>
        </Group>
      </Dropzone>

      {form.errors.files && (
        <Text c="red" mt={5}>
          {form.errors.files}
        </Text>
      )}

      {imgPreviews.length > 0 && (
        <>
          <Flex justify="space-between" align="center">
            <Text mb={5} mt="md">
              Selected files (click to remove):
            </Text>
            <Button disabled={loading} size="sm" onClick={handleSaveImages}>
              Save Images
            </Button>
          </Flex>

          <ScrollArea h={150}>
            <Grid style={{ padding: '10px' }}>
              {imgPreviews.map((preview, index) => (
                <Grid.Col
                  key={preview}
                  span={2}
                  className={classes.swatchContainer}
                  style={{
                    backgroundImage: `url(${preview})`,
                    backgroundSize: 'cover',
                  }}
                  onClick={() => removeFile(index)}
                >
                  <CloseButton
                    size="md"
                    icon={
                      <IconXboxX
                        size={26}
                        strokeWidth={1.5}
                        fill="white"
                        color="red"
                      />
                    }
                    style={{ position: 'relative', top: -15, right: -35 }}
                    className={classes.uploadImgSampleCloseButton}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </ScrollArea>
        </>
      )}
    </>
  )
}
