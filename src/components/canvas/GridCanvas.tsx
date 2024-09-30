import classes from './GridCanvas.module.css'

export default function GridCanvas() {
  return (
    <div className={classes.canvasContainer}>
      <canvas className={classes.canvas} />
    </div>
  )
}
