/** Toolbar UI modified from Mantine's example:
 *  https://ui.mantine.dev/component/navbar-minimal/
 */
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { setTool } from '../../store/toolbarSlice'
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
  { icon: IconPencil, label: 'Draw (d)', id: 'draw', key: 'd' },
  { icon: IconEraser, label: 'Erase (e)', id: 'erase', key: 'e' },
  { icon: IconPalette, label: 'Palette (p)', id: 'palette', key: 'p' },
  {
    icon: IconGrid4x4,
    label: 'Grid Settings (g)',
    id: 'gridSettings',
    key: 'g',
  },
  {
    icon: IconDeviceFloppy,
    label: 'Save Pattern (s)',
    id: 'savePattern',
    key: 's',
  },
  { icon: IconUpload, label: 'Load Pattern (l)', id: 'loadPattern', key: 'l' },
  { icon: IconTrash, label: 'Clear (c)', id: 'clearAll', key: 'c' },
]

export default function Toolbar() {
  const dispatch = useAppDispatch()
  const toolbarState = useAppSelector((state) => state.toolbar)

  // keyboard shortcuts for toolbar buttons
  // TODO: add shortcut for help button when implemented
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const keyID = toolbarItems.find((item) => item.key === key)?.id

      if (keyID) {
        dispatch(setTool(keyID))
      }

      // help button is not in toolbarItems and needs to be accounted for separately
      else if (key == 'h') {
        dispatch(setTool('help'))
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
            active={toolbarState[item.id as keyof typeof toolbarState]}
            onClick={() => dispatch(setTool(item.id))}
          />
        ))}
      </Stack>
      <Stack justify="center" gap={0}>
        <ColorSchemeButton />
        <ToolbarLink
          icon={IconQuestionMark}
          label="Help (h)"
          active={toolbarState.help}
          onClick={() => dispatch(setTool('help'))}
        />
      </Stack>
    </div>
  )
}
