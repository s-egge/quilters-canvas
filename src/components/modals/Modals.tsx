import UnderConstruction from './UnderConstruction'
import Palette from './palette/Palette'
import GridSettings from './gridSettings/GridSettings'

export default function Modals() {
  return (
    <>
      {window.location.hostname !== 'localhost' && <UnderConstruction />}
      <Palette />
      <GridSettings />
    </>
  )
}
