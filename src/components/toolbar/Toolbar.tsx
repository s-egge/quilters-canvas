/** Toolbar modified from Mantine's example:
 *  https://ui.mantine.dev/component/navbar-minimal/
 */
import { useState, useEffect } from 'react'
import { Stack, Text, Tooltip, UnstyledButton, rem } from '@mantine/core'
import {
  Icon,
  IconEraser,
  IconTrash,
  IconPencil,
  IconPalette,
  IconGrid4x4,
  IconDeviceFloppy,
  IconUpload,
  IconQuestionMark,
} from '@tabler/icons-react'
import ColorSchemeButton from '../ui/ColorSchemeButton'
import classes from './Toolbar.module.css'

function ToolbarLink({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: Icon
  label: string
  active?: boolean
  onClick?(): void
}) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        className={classes.tool}
        onClick={onClick}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

const toolbarItems = [
  { icon: IconPencil, label: 'Draw (d)', key: 'd' },
  { icon: IconEraser, label: 'Erase (e)', key: 'e' },
  { icon: IconPalette, label: 'Palette (p)', key: 'p' },
  { icon: IconGrid4x4, label: 'Grid Settings (g)', key: 'g' },
  { icon: IconDeviceFloppy, label: 'Save Pattern (s)', key: 's' },
  { icon: IconUpload, label: 'Load Pattern (l)', key: 'l' },
  { icon: IconTrash, label: 'Clear (c)', key: 'c' },
]

export default function Toolbar() {
  const [active, setActive] = useState(0)

  // keyboard shortcuts for toolbar buttons
  // TODO: add shortcut for help button when implemented
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const index = toolbarItems.findIndex((item) => item.key === key)
      if (index !== -1) setActive(index)
      else if (key === 'h') {
        console.log('TODO: implement help button')
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  return (
    <div className={classes.toolbarContainer}>
      <Text ta="center" fw={700} size="xl">
        QDA
      </Text>

      <Stack justify="flex-start" gap={0} className={classes.toolbarMain}>
        {toolbarItems.map((item, index) => (
          <ToolbarLink
            key={index}
            icon={item.icon}
            label={item.label}
            active={index == active}
            onClick={() => setActive(index)}
          />
        ))}
      </Stack>
      <Stack justify="center" gap={0}>
        <ColorSchemeButton />
        <ToolbarLink icon={IconQuestionMark} label="Help (h)" />
      </Stack>
    </div>
  )
}
