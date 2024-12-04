import Palette from './palette/Palette'
import GridSettings from './gridSettings/GridSettings'
import EditSwatchModal from './editSwatch/EditSwatchModal'
import ClearCanvas from './ClearCanvas'
import SavePattern from './SavePattern'
import LoadPattern from './LoadPattern'
import Help from './Help'

export default function Modals() {
  return (
    <>
      <Palette />
      <EditSwatchModal />
      <GridSettings />
      <ClearCanvas />
      <SavePattern />
      <LoadPattern />
      <Help />
    </>
  )
}
