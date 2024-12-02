interface Swatch {
  type: 'color' | 'url' | 'image'
  color?: string
  url?: string
  scale?: number
}

enum GridShape {
  Hexagon = 'hexagon',
  Square = 'square',
}

interface Shape {
  type: GridShape.Hexagon | GridShape.Square
  x: number
  y: number
  gridX: number
  gridY: number
  fill?: Swatch
}

interface PaletteState {
  currentSwatch: Swatch
  savedSwatches: Swatch[]
  swatchScaleChange: boolean
}

interface CanvasState {
  title: string
  description: string
  shapes: Shape[]
  gridShape: GridShape
  shapeSize: number
  height: number
  width: number
  gridHeight: number
  gridWidth: number
  gridColor: string
  gridVisible: boolean
  clearCanvas: boolean
  loadPattern: boolean
}

export type { Swatch, Shape, PaletteState, CanvasState }
export { GridShape }
