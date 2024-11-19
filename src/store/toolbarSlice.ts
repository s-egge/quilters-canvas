import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface ToolbarState {
  draw: boolean
  erase: boolean
  palette: boolean
  editSwatch: boolean // not in toolbar but nested in palette modal
  gridSettings: boolean
  savePattern: boolean
  loadPattern: boolean
  clearAll: boolean
  help: boolean
}

const initialState: ToolbarState = {
  draw: true,
  erase: false,
  palette: false,
  editSwatch: false,
  gridSettings: false,
  savePattern: false,
  loadPattern: false,
  clearAll: false,
  help: false,
}

const setAllToFalse = (state: ToolbarState) => {
  state.draw = false
  state.erase = false
  state.palette = false
  state.editSwatch = false
  state.gridSettings = false
  state.savePattern = false
  state.loadPattern = false
  state.clearAll = false
  state.help = false
}

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setTool(state, action: PayloadAction<string>) {
      setAllToFalse(state)
      state[action.payload as keyof ToolbarState] = true
    },
    toggleTool(state, action: PayloadAction<string>) {
      state[action.payload as keyof ToolbarState] =
        !state[action.payload as keyof ToolbarState]
    },
  },
})

export default toolbarSlice.reducer
export const { setTool, toggleTool } = toolbarSlice.actions
export const selectToolbar = (state: RootState) => state.toolbar
