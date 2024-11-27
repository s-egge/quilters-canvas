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

// resize an array of shapes to match a new grid shape/size
export function resizeShapesArray(
  oldShapes: Shape[],
  newShapes: Shape[],
): Shape[] {
  const newShapesArray: Shape[] = []

  for (let i = 0; i < newShapes.length; i++) {
    newShapesArray.push(newShapes[i])

    // look for matching grid x/y in oldShapes
    const oldShape = oldShapes.find(
      (oldShape) =>
        oldShape.gridX == newShapes[i].gridX &&
        oldShape.gridY == newShapes[i].gridY,
    )

    if (oldShape) {
      newShapes[i].fill = oldShape.fill
    }
  }
  return newShapesArray
}
