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

export type { Swatch }
export { GridShape }
