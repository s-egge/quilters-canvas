import UnderConstruction from './UnderConstruction'
import Palette from './palette/Palette'
import GridSettings from './gridSettings/GridSettings'
import EditSwatchModal from './editSwatch/EditSwatchModal'
import ClearCanvas from './ClearCanvas'

export default function Modals() {
  return (
    <>
      {window.location.hostname !== 'localhost' && <UnderConstruction />}
      <Palette />
      <EditSwatchModal />
      <GridSettings />
      <ClearCanvas />
    </>
  )
}
