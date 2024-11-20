import { GridShape, Shape, Swatch } from './interfaces'
import { findClosestSquare, findClosestHexagon } from './mathTools'

function fillHexagonWithImage(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  img: HTMLImageElement,
  scale?: number,
) {
  const hexDiameter = 2 * r
  const imgAspectRatio = img.width / img.height
  let drawWidth, drawHeight

  // determine the best fit: by width or by height
  if (imgAspectRatio < 1) {
    // image is taller than it is wide
    drawWidth = Math.floor(hexDiameter)
    drawHeight = Math.floor(hexDiameter / imgAspectRatio)
  } else {
    // image is wider than tall (or square)
    drawHeight = Math.floor(hexDiameter)
    drawWidth = Math.floor(hexDiameter * imgAspectRatio)
  }

  // calculate offsets to center the image in the hexagon
  const offsetX = Math.floor(x - drawWidth / 2)
  const offsetY = Math.floor(y - drawHeight / 2)

  let sourceWidth = img.width
  let sourceHeight = img.height

  if (scale) {
    sourceWidth *= scale
    sourceHeight *= scale
  }

  // randomize the portion of the image to draw
  const randomX = Math.floor(Math.random() * (img.width - sourceWidth))
  const randomY = Math.floor(Math.random() * (img.height - sourceHeight))

  // Draw the image
  c.drawImage(
    img,
    randomX, // source x
    randomY, // source y
    sourceWidth, // source width
    sourceHeight, // source height
    offsetX, // destination x
    offsetY, // destination y
    drawWidth, // destination width
    drawHeight, // destination height
  )
}

// Hexagon math sourced from https://eperezcosano.github.io/hex-grid/
function drawHexagon(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  swatch: Swatch,
  img?: HTMLImageElement,
) {
  c.save()
  c.beginPath()

  for (var i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    c.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
  }
  c.closePath()

  if (swatch.type === 'color' && swatch.color) {
    c.fillStyle = swatch.color
    c.fill()
  }

  // handle image fill
  else if ((swatch.type === 'url' || swatch.type === 'image') && swatch.url) {
    c.clip()

    // load image if not provided
    if (!img) {
      const img = new Image()

      img.onload = () => {
        fillHexagonWithImage(c, x, y, r, img, swatch.scale)
        c.restore()
      }

      img.onerror = () => {
        console.error('Could not load image')
        c.restore()
      }

      img.src = swatch.url
    } else {
      fillHexagonWithImage(c, x, y, r, img, swatch.scale)
      c.restore()
    }
  }
}

function fillSquareWithImage(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  img: HTMLImageElement,
  scale?: number,
) {
  const imgAspectRatio = img.width / img.height
  let sourceWidth, sourceHeight

  // determine the best fit: by width or by height
  if (imgAspectRatio > 1) {
    // image is taller than it is wide
    sourceWidth = img.width
    sourceHeight = img.height / imgAspectRatio
  } else {
    // image is wider than tall (or square)
    sourceHeight = img.height
    sourceWidth = img.width * imgAspectRatio
  }

  if (scale) {
    sourceWidth *= scale
    sourceHeight *= scale
  }

  // randomize the portion of the image to draw
  const randomX = Math.random() * (img.width - sourceWidth)
  const randomY = Math.random() * (img.height - sourceHeight)

  // draw a random part of the image to fill the square
  c.drawImage(
    img,
    randomX,
    randomY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    length,
    length,
  )
}

function drawSquare(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  swatch: Swatch,
  img?: HTMLImageElement,
): Shape {
  c.save()

  if (swatch.type === 'color' && swatch.color) {
    c.fillStyle = swatch.color
    c.fillRect(x, y, length, length)
  }

  // handle image fill
  else if ((swatch.type === 'url' || swatch.type === 'image') && swatch.url) {
    // load image if not provided
    if (!img) {
      console.log('Loading image')
      const img = new Image()
      img.onload = () => {
        fillSquareWithImage(c, x, y, length, img, swatch.scale)
        c.restore()
      }

      img.onerror = () => {
        console.error('Could not load image')
        c.restore()
      }
      img.src = swatch.url
    } else {
      console.log('Image already loaded, drawing')
      fillSquareWithImage(c, x, y, length, img, swatch.scale)
      c.restore()
    }
  }

  return {
    type: GridShape.Square,
    x,
    y,
    gridX: Math.floor(x / length),
    gridY: Math.floor(y / length),
    fill: swatch,
  }
}

export function drawShape(
  c: CanvasRenderingContext2D,
  shape: GridShape,
  x: number,
  y: number,
  r: number,
  swatch: Swatch,
  img?: HTMLImageElement,
) {
  if (shape === GridShape.Hexagon) {
    drawHexagon(c, x, y, r, swatch, img)
  } else if (shape === GridShape.Square) {
    drawSquare(c, x, y, r, swatch, img)
  }
}

export function fillClosestShape(
  c: CanvasRenderingContext2D,
  shapes: Shape[],
  shape: GridShape,
  gridWidth: number,
  shapeSize: number,
  x: number,
  y: number,
  swatch: Swatch,
  img?: HTMLImageElement,
): Shape | undefined {
  let closestShape = null

  if (shape == GridShape.Square) {
    closestShape = findClosestSquare(x, y, gridWidth, shapeSize, shapes)
  } else if (shape == GridShape.Hexagon) {
    closestShape = findClosestHexagon(x, y, gridWidth, shapeSize, shapes)
  }

  if (!closestShape) {
    return
  }

  drawShape(c, shape, closestShape.x, closestShape.y, shapeSize, swatch, img)

  return {
    type: closestShape.type,
    x: closestShape.x,
    y: closestShape.y,
    gridX: closestShape.gridX,
    gridY: closestShape.gridY,
    fill: swatch,
  }
}

// ****************** Erase functions ****************** //
function clearSquare(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  c.clearRect(x, y, r, r)
}

function clearHexagon(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  // save state of canvas
  c.save()

  // clear the hexagon
  c.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    c.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle))
  }
  c.closePath()

  //set clipping region to hexagon
  c.clip()

  // clear the hexagon
  c.clearRect(x - r, y - r, 2 * r, 2 * r)

  // restore state of canvas
  c.restore()
}

export function clearClosestShape(
  c: CanvasRenderingContext2D,
  shapes: Shape[],
  shape: GridShape,
  gridWidth: number,
  shapeSize: number,
  x: number,
  y: number,
): Shape | undefined {
  let closestShape = null

  if (shape == GridShape.Square) {
    closestShape = findClosestSquare(x, y, gridWidth, shapeSize, shapes)

    if (closestShape && closestShape.fill) {
      clearSquare(c, closestShape.x, closestShape.y, shapeSize)
      return {
        type: closestShape.type,
        x: closestShape.x,
        y: closestShape.y,
        gridX: closestShape.gridX,
        gridY: closestShape.gridY,
        fill: undefined,
      }
    }
  } else if (shape == GridShape.Hexagon) {
    closestShape = findClosestHexagon(x, y, gridWidth, shapeSize, shapes)

    if (closestShape && closestShape.fill) {
      clearHexagon(c, closestShape.x, closestShape.y, shapeSize)
      return {
        type: closestShape.type,
        x: closestShape.x,
        y: closestShape.y,
        gridX: closestShape.gridX,
        gridY: closestShape.gridY,
        fill: undefined,
      }
    }
  }
}
