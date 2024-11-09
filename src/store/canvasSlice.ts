import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { GridShape, Shape } from '@utils/interfaces'

interface CanvasState {
  shapes: Shape[]
  gridShape: GridShape
  shapeSize: number
  height: number
  width: number
  gridHeight: number
  gridWidth: number
}

const initialState: CanvasState = {
  shapes: [],
  gridShape: GridShape.Hexagon,
  shapeSize: 50,
  height: 200,
  width: 200,
  gridHeight: 4,
  gridWidth: 5,
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setGridShape: (state, action: PayloadAction<GridShape>) => {
      state.gridShape = action.payload
    },
    setShapes: (state, action: PayloadAction<Shape[]>) => {
      state.shapes = action.payload
    },
    updateShape(state, action: PayloadAction<Shape>) {
      const newShape = action.payload
      const index = newShape.gridY * state.gridWidth + newShape.gridX
      state.shapes[index] = newShape
    },
    setShapeSize: (state, action: PayloadAction<number>) => {
      state.shapeSize = action.payload
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload
    },
    setGridHeight: (state, action: PayloadAction<number>) => {
      state.gridHeight = action.payload
    },
    setGridWidth: (state, action: PayloadAction<number>) => {
      state.gridWidth = action.payload
    },
  },
})

export default canvasSlice.reducer
export const {
  setGridShape,
  setShapes,
  updateShape,
  setShapeSize,
  setHeight,
  setWidth,
  setGridHeight,
  setGridWidth,
} = canvasSlice.actions
export const selectCanvas = (state: RootState) => state.canvas
