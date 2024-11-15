import '@mantine/core/styles.css'
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core'
import Toolbar from './components/toolbar/Toolbar'
import Canvas from './components/canvas/Canvas'
import Modals from './components/modals/Modals'
import './App.css'

const paleBlue: MantineColorsTuple = [
  '#e7f8ff',
  '#daebf5',
  '#b8d3e2',
  '#94bbd0',
  '#75a6c1',
  '#6099b8',
  '#5492b4',
  '#437e9f',
  '#35718f',
  '#216281',
]

const theme = createTheme({
  /** Mantine theme overrides go here
   * https://mantine.dev/theming/mantine-provider/
   * https://mantine.dev/theming/theme-object/
   */
  autoContrast: true,
  colors: {
    paleBlue: paleBlue,
  },
  primaryColor: 'paleBlue',
})

function App() {
  return (
    <MantineProvider theme={theme}>
      <Toolbar />
      <Modals />
      <Canvas />
    </MantineProvider>
  )
}

export default App
