/** Toolbar UI modified from Mantine's example:
 *  https://ui.mantine.dev/component/navbar-minimal/
 */
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { toggleTool } from '../../store/toolbarSlice'
import { Stack, Tooltip, UnstyledButton, rem } from '@mantine/core'
import { Icon, IconQuestionMark } from '@tabler/icons-react'
import ColorSchemeButton from '../ui/ColorSchemeButton'
import classes from './Toolbar.module.css'
import { toolbarItems } from './Tools'
import Logo from '../../assets/logo.tsx'

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

export default function Toolbar() {
  const dispatch = useAppDispatch()
  const toolbarState = useAppSelector((state) => state.toolbar)

  // keyboard shortcuts for toolbar buttons
  // TODO: add shortcut for help button when implemented
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // disable shortcuts when typing in input or textarea
      if (
        ['input', 'textarea'].includes(
          (event.target as HTMLElement).tagName.toLowerCase(),
        )
      )
        return

      const key = event.key.toLowerCase()
      const tool = toolbarItems.find((item) => item.key === key)

      if (tool) {
        dispatch(tool.onClick(tool.id))
      }

      // help button is not in toolbarItems and needs to be accounted for separately
      else if (key == 'h') {
        dispatch(toggleTool('help'))
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  return (
    <div className={classes.toolbarContainer}>
      <div className={classes.logo}>
        <Logo color={'var(--mantine-primary-color-8)'} />
      </div>
      <Stack justify="flex-start" gap={0} className={classes.toolbarMain}>
        {toolbarItems.map((tool, index) => (
          <ToolbarLink
            key={index}
            icon={tool.icon}
            label={tool.label}
            active={toolbarState[tool.id as keyof typeof toolbarState]}
            onClick={() => dispatch(tool.onClick(tool.id))}
          />
        ))}
      </Stack>
      <Stack justify="center" gap={0}>
        <ColorSchemeButton />
        <ToolbarLink
          icon={IconQuestionMark}
          label="Help (h)"
          active={toolbarState.help}
          onClick={() => dispatch(toggleTool('help'))}
        />
      </Stack>
    </div>
  )
}
