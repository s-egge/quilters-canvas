import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import type { Swatch, PaletteState } from '@utils/interfaces'

const imgSwatch1: Swatch = {
  type: 'url',
  url: 'https://www.joann.com/dw/image/v2/AAMM_PRD/on/demandware.static/-/Sites-joann-product-catalog/default/dw528b46d0/images/hi-res/20/20034286.jpg?sw=556&sh=680&sm=fit',
  scale: 1,
}

const imgSwatch2: Swatch = {
  type: 'url',
  url: 'https://www.joann.com/dw/image/v2/AAMM_PRD/on/demandware.static/-/Sites-joann-product-catalog/default/dwe956e04c/images/hi-res/19/19470871.jpg?sw=556&sh=680&sm=fit',
  scale: 1,
}

const imgSwatch3: Swatch = {
  type: 'url',
  url: 'https://www.joann.com/dw/image/v2/AAMM_PRD/on/demandware.static/-/Sites-joann-product-catalog/default/dw939dd85f/images/hi-res/19/19401314.jpg?sw=480&q=60',
  scale: 1,
}

const testSwatchesArray: Swatch[] = [
  imgSwatch3,
  { type: 'color', color: '#000000' }, // Black
  { type: 'color', color: '#ff0000' }, // Red
  imgSwatch1,
  { type: 'color', color: '#00ff00' }, // Green
  { type: 'color', color: '#0000ff' }, // Blue
  { type: 'color', color: '#ff00ff' }, // Magenta
  imgSwatch2,
  { type: 'color', color: '#ffff00' }, // Yellow
  { type: 'color', color: '#00ffff' }, // Cyan
  { type: 'color', color: '#ff7f00' }, // Orange
  { type: 'color', color: '#7f00ff' }, // Purple
  { type: 'color', color: '#7f7f7f' }, // Gray
  { type: 'color', color: '#b22222' }, // Firebrick
  { type: 'color', color: '#228b22' }, // ForestGreen
  { type: 'color', color: '#4682b4' }, // SteelBlue
  { type: 'color', color: '#dda0dd' }, // Plum
  { type: 'color', color: '#f08080' }, // LightCoral
  { type: 'color', color: '#ffd700' }, // Gold
  { type: 'color', color: '#20b2aa' }, // LightSeaGreen
  { type: 'color', color: '#6495ed' }, // CornflowerBlue
  { type: 'color', color: '#dc143c' }, // Crimson
  { type: 'color', color: '#8a2be2' }, // BlueViolet
  { type: 'color', color: '#ff1493' }, // DeepPink
  { type: 'color', color: '#7cfc00' }, // LawnGreen
  { type: 'color', color: '#8b0000' }, // DarkRed
  { type: 'color', color: '#2e8b57' }, // SeaGreen
]

const initialState: PaletteState = {
  currentSwatch: imgSwatch3,
  savedSwatches: testSwatchesArray,
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
