import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import type { Swatch, PaletteState } from '@utils/interfaces'

const defaultSwatch: Swatch = { type: 'color', color: '#4d90bd' }

const initialState: PaletteState = {
  currentSwatch: defaultSwatch,
  savedSwatches: [defaultSwatch],
  swatchScaleChange: false,
}

const deleteSwatch = (state: PaletteState, swatchToDelete: Swatch) => {
  state.savedSwatches = state.savedSwatches.filter((swatch) => {
    if (swatch.type === 'color' && swatch.color !== swatchToDelete.color)
      return swatch
    else if (swatch.type === 'url' && swatch.url !== swatchToDelete.url)
      return swatch
  })
}

const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {
    setSwatch(state, action: PayloadAction<Swatch>) {
      // add default scale if needed for new swatches
      const newSwatch = {
        ...action.payload,
        scale: action.payload.scale ? action.payload.scale : 1,
      }
      state.currentSwatch = newSwatch
      // move to front of palette
      deleteSwatch(state, action.payload)
      state.savedSwatches.unshift(newSwatch)
    },
    removeSwatch(state, action: PayloadAction<Swatch>) {
      deleteSwatch(state, action.payload)
      if (state.savedSwatches.length > 0)
        state.currentSwatch = state.savedSwatches[0]
      // always have at least one swatch
      else {
        state.currentSwatch = { type: 'color', color: '#000000' }
        state.savedSwatches.push(state.currentSwatch)
      }
    },
    // when the scale changes, the canvas may need to redraw all instances of the image
    toggleSwatchScaleChange(state, action: PayloadAction<boolean>) {
      state.swatchScaleChange = action.payload
    },
    loadPalette(state, action: PayloadAction<PaletteState>) {
      state.savedSwatches = action.payload.savedSwatches
      state.currentSwatch = action.payload.currentSwatch
      state.swatchScaleChange = false
    },
  },
})

export default paletteSlice.reducer
export const { setSwatch, removeSwatch, toggleSwatchScaleChange, loadPalette } =
  paletteSlice.actions
export const selectPalette = (state: RootState) => state.palette
