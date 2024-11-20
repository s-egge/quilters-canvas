import { Swatch, Shape } from './interfaces'

export function shapeContainsSwatch(shape: Shape, swatch: Swatch): boolean {
  if (
    (shape.fill?.type === 'color' && swatch.type === 'color') ||
    (shape.fill?.url && swatch.url && shape.fill.url === swatch.url)
  ) {
    return true
  }

  return false
}
