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

export type { Swatch, Shape }
export { GridShape }
