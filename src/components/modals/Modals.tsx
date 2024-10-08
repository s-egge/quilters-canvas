import UnderConstruction from './UnderConstruction'
import Palette from './Palette'

export default function Modals() {
  return (
    <>
      {window.location.hostname !== 'localhost' && <UnderConstruction />}
      <Palette />
    </>
  )
}
