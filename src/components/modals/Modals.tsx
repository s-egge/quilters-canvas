import UnderConstruction from './UnderConstruction'
import Palette from './palette/Palette'

export default function Modals() {
  return (
    <>
      {window.location.hostname !== 'localhost' && <UnderConstruction />}
      <Palette />
    </>
  )
}
