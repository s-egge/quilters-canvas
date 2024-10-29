import { GridShape, Shape } from './interfaces'

// somewhat arbitrary min sizes based on testing what looks good, might change later
const MIN_SQUARE_SIZE = 50
const MIN_HEX_SIZE = 35

function getMinimumSquareSize(
  gridWidth: number,
  gridHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const squareWidth = Math.floor(canvasWidth / gridWidth)
  const squareHeight = Math.floor(canvasHeight / gridHeight)
  const squareSize = Math.min(squareWidth, squareHeight)
  return Math.max(squareSize, MIN_SQUARE_SIZE)
}

export function getMinimumShapeSize(
  gridShape: GridShape,
  gridWidth: number,
  gridHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  if (gridShape === GridShape.Square) {
    return getMinimumSquareSize(
      gridWidth,
      gridHeight,
      canvasWidth,
      canvasHeight,
    )
  }

  return MIN_HEX_SIZE
}

export function findClosestSquare(
  x: number,
  y: number,
  squareSize: number,
  shapes: Shape[],
): Shape | undefined {
  const gridX = Math.floor(x / squareSize)
  const gridY = Math.floor(y / squareSize)

  const shape = shapes.find(
    (shape) => shape.gridX === gridX && shape.gridY === gridY,
  )

  return shape
}
