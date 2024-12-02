import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { GridShape, Shape, CanvasState } from '@utils/interfaces'

const initialState: CanvasState = {
  title: '',
  description: '',
  shapes: [],
  gridShape: GridShape.Hexagon,
  shapeSize: 50,
  height: 200,
  width: 200,
  gridHeight: 6,
  gridWidth: 8,
  gridColor: '#000000',
  gridVisible: true,
  clearCanvas: false,
  loadPattern: false,
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
    setGridVisible: (state, action: PayloadAction<boolean>) => {
      state.gridVisible = action.payload
    },
    setGridColor: (state, action: PayloadAction<string>) => {
      state.gridColor = action.payload
    },
    setClearCanvas: (state, action: PayloadAction<boolean>) => {
      // clear all fills if clearing canvas
      if (action.payload) {
        for (const shape of state.shapes) {
          shape.fill = undefined
        }
      }
      state.clearCanvas = action.payload
    },
    setLoadPattern: (state, action: PayloadAction<boolean>) => {
      state.loadPattern = action.payload
    },
    loadCanvas: (state, action: PayloadAction<CanvasState>) => {
      Object.assign(state, action.payload)
      state.loadPattern = true
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
  setGridVisible,
  setGridColor,
  setClearCanvas,
  setLoadPattern,
  loadCanvas,
} = canvasSlice.actions
export const selectCanvas = (state: RootState) => state.canvas
