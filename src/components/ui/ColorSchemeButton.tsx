import { useEffect } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import {
  Tooltip,
  UnstyledButton,
  rem,
  useMantineColorScheme,
} from '@mantine/core'
import classes from '../toolbar/Toolbar.module.css'

export default function ColorSchemeButton() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const label = colorScheme === 'dark' ? 'Light Mode (m)' : 'Dark Mode (m)'

  // keyboard shortcut to toggle color scheme
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // disable shortcuts when typing in input or textarea
      if (
        ['input', 'textarea'].includes(
          (event.target as HTMLElement).tagName.toLowerCase(),
        )
      )
        return
      if (event.key === 'm' || event.key === 'M') {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [colorScheme])

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        className={classes.tool}
        onClick={() =>
          setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
        }
        aria-label={label}
      >
        {colorScheme === 'dark' ? (
          <IconSun style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        ) : (
          <IconMoon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        )}
      </UnstyledButton>
    </Tooltip>
  )
}
