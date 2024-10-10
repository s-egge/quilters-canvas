import { configureStore } from '@reduxjs/toolkit'
import toolbarReducer from './toolbarSlice'
import paletteReducer from './paletteSlice'

const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    palette: paletteReducer,
  },
})

store.subscribe(() => {
  console.log('store updated: ', store.getState())
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
