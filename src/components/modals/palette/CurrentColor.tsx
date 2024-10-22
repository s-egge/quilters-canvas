import classes from './Palette.module.css'
import type { Swatch } from '@utils/interfaces.ts'

export default function CurrentColor({
  currentSwatch,
}: {
  currentSwatch: Swatch
}) {
  if (currentSwatch.type === 'color') {
    return (
      <div
        className={`${classes.currentColor}`}
        style={{ backgroundColor: currentSwatch.color }}
      ></div>
    )
  } else if (currentSwatch.url) {
    return (
      <div className={`${classes.currentColor}`}>
        <img src={currentSwatch.url}></img>
      </div>
    )
  } else return null
}
