import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { GridShape } from '@utils/interfaces'

interface CanvasState {
  gridShape: GridShape
}

const initialState: CanvasState = {
  gridShape: GridShape.Square,
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setGridShape: (state, action: PayloadAction<GridShape>) => {
      state.gridShape = action.payload
    },
  },
})

export default canvasSlice.reducer
export const { setGridShape } = canvasSlice.actions
export const selectCanvas = (state: RootState) => state.canvas
