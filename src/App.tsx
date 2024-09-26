import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const theme = createTheme({
  /** Mantine theme overrides go here
   * https://mantine.dev/theming/mantine-provider/
   * https://mantine.dev/theming/theme-object/
   */
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <MantineProvider theme={theme}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </MantineProvider>
  )
}

export default App
