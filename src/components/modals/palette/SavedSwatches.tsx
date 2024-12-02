import classes from './Palette.module.css'
import { useAppDispatch } from '@store/hooks.ts'
import type { Swatch } from '@utils/interfaces.ts'
import { setSwatch, removeSwatch } from '@store/paletteSlice.ts'
import { toggleTool } from '@store/toolbarSlice.ts'
import {
  Button,
  Group,
  Stack,
  Grid,
  ScrollArea,
  Indicator,
} from '@mantine/core'

const EDIT_MODAL = 'editSwatch'
const PALLETTE_MODAL = 'palette'

function SwatchSample({
  swatch,
  currentSwatch,
  onClick,
}: {
  swatch: Swatch
  currentSwatch?: Swatch
  onClick?: () => void
}) {
  const isCurrentSwatch =
    (swatch.type === 'color' && swatch.color == currentSwatch?.color) ||
    (swatch.type === 'url' && swatch.url == currentSwatch?.url)
  const isColor = swatch.type === 'color'
  const isImage = swatch.type === 'url' || swatch.type === 'image'

  const swatchStyles = {
    backgroundColor: isColor ? swatch.color : undefined,
    backgroundImage: isImage ? `url(${swatch.url})` : undefined,
    backgroundSize: isImage ? 'cover' : undefined,
    boxShadow:
      'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
  }

  return (
    <Grid.Col
      span={2}
      className={classes.swatchContainer}
      style={swatchStyles}
      onClick={onClick}
    >
      <Indicator disabled={!isCurrentSwatch} offset={-5} size={15}></Indicator>
    </Grid.Col>
  )
}

export default function SavedSwatches({
  savedSwatches,
  currentSwatch,
}: {
  savedSwatches: Swatch[]
  currentSwatch: Swatch
}) {
  const dispatch = useAppDispatch()

  const handleEditSwatch = () => {
    dispatch(toggleTool(EDIT_MODAL))
    dispatch(toggleTool(PALLETTE_MODAL))
  }

  return (
    <Stack>
      <ScrollArea mb="sm" h={200}>
        <Grid style={{ padding: '10px' }}>
          {savedSwatches.map((swatch) => (
            <SwatchSample
              key={`${swatch.type}-${
                swatch.type === 'color' ? swatch.color : swatch.url
              }`}
              swatch={swatch}
              currentSwatch={currentSwatch}
              onClick={() => dispatch(setSwatch(swatch))}
            />
          ))}
        </Grid>
      </ScrollArea>
      <Group justify="space-around">
        <Button
          disabled={savedSwatches.length === 0}
          onClick={() => dispatch(removeSwatch(currentSwatch))}
        >
          Delete Swatch
        </Button>
        <Button
          disabled={
            savedSwatches.length === 0 || currentSwatch.type === 'color'
          }
          onClick={handleEditSwatch}
        >
          Edit Swatch
        </Button>
      </Group>
    </Stack>
  )
}
