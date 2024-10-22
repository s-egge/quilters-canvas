import { useAppDispatch } from '@store/hooks.ts'
import { useState } from 'react'
import { setSwatch } from '@store/paletteSlice.ts'
import { Button, Group, Stack, ColorPicker, ColorInput } from '@mantine/core'

export default function AddPaletteColor({
  currentColor,
}: {
  currentColor: string | undefined
}) {
  const dispatch = useAppDispatch()
  const [color, setColor] = useState<string>(
    currentColor ? currentColor : '#000000',
  )

  return (
    <>
      <Group justify="space-between">
        <Stack gap="xs">
          <ColorPicker value={color} onChange={setColor} />
          <ColorInput withPicker={false} value={color} onChange={setColor} />
        </Stack>
        <Button
          style={{ alignSelf: 'flex-end' }}
          onClick={() => {
            dispatch(setSwatch({ type: 'color', color }))
          }}
        >
          Save
        </Button>
      </Group>
    </>
  )
}
