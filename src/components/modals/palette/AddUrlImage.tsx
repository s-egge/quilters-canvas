import classes from './Palette.module.css'
import { useAppDispatch } from '@app/store/hooks'
import { useState } from 'react'
import { setSwatch } from '@app/store/paletteSlice'
import { IconPhotoPlus, IconPhotoCancel } from '@tabler/icons-react'
import { Button, TextInput, Image, Stack, Group, Loader } from '@mantine/core'

// source: https://www.zhenghao.io/posts/verify-image-url
const isImgUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      new URL(url)
      const img = document.createElement('img')
      img.src = url
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
    } catch {
      resolve(false)
    }
  })
}

export default function AddImageUrl() {
  const dispatch = useAppDispatch()
  const [canSaveImage, setCanSaveImage] = useState<boolean>(false)
  const [canLoadImage, setCanLoadImage] = useState<boolean>(false)
  const [loadingImage, setLoadingImage] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [img, setImg] = useState<string>('')
  const [imgInput, setImgInput] = useState<string>('')

  const loadImage = () => {
    setImg('')
    setLoadingImage(true)
    setCanSaveImage(false)
    setError(false)

    isImgUrl(imgInput).then((res) => {
      if (res) {
        setImg(imgInput)
        setCanSaveImage(true)
        setError(false)
        setImgInput('')
        setLoadingImage(false)
      } else {
        setError(true)
        setCanSaveImage(false)
        setLoadingImage(false)
      }
    })
  }

  const saveImage = () => {
    setLoadingImage(true)
    if (img) {
      dispatch(setSwatch({ type: 'url', url: img }))
      setCanSaveImage(false)
      setCanLoadImage(false)
      setImgInput('')
      setImg('')
    }
    setLoadingImage(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgInput(e.target.value)

    if (e.target.value === '') {
      setCanLoadImage(false)
    } else setCanLoadImage(true)
  }

  return (
    <Stack align="stretch">
      {img && <Image radius="md" src={img} mah={150} />}
      {!img && (
        <div className={classes.addImageUrlPlaceholder}>
          {loadingImage ? (
            <Loader size="xl" />
          ) : (
            <>
              {error ? (
                <>
                  <IconPhotoCancel
                    style={{ width: '50%', height: '50%', color: 'red' }}
                    stroke={1.5}
                  />
                  <p style={{ color: 'red' }}>
                    Could not load image, invalid URL
                  </p>
                </>
              ) : (
                <>
                  <IconPhotoPlus
                    style={{ width: '50%', height: '50%', color: 'grey' }}
                    stroke={1.5}
                  />
                  <p>Enter an image URL below</p>
                </>
              )}
            </>
          )}
        </div>
      )}
      <TextInput
        placeholder="Enter Image URL"
        value={imgInput}
        onChange={handleInputChange}
      />
      <Group justify="space-around">
        <Button disabled={!canLoadImage} onClick={loadImage}>
          Load Image
        </Button>
        <Button disabled={!canSaveImage} onClick={saveImage}>
          Save Image
        </Button>
      </Group>
    </Stack>
  )
}
