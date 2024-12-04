import {
  IconPencil,
  IconEraser,
  IconPalette,
  IconGrid4x4,
  IconDeviceFloppy,
  IconUpload,
  IconTrash,
  IconZoom,
} from '@tabler/icons-react'

import { setTool, toggleTool } from '../../store/toolbarSlice'

export const toolbarItems = [
  {
    icon: IconPencil,
    name: 'Draw',
    description:
      'Draw on the canvas with the selected swatch by clicking or clicking and dragging.',
    label: 'Draw (d)',
    onClick: setTool,
    id: 'draw',
    key: 'd',
  },
  {
    icon: IconEraser,
    name: 'Erase',
    description:
      'Erase swatches from the canvas by clicking or clicking and dragging.',
    label: 'Erase (e)',
    onClick: setTool,
    id: 'erase',
    key: 'e',
  },
  {
    icon: IconPalette,
    name: 'Palette',
    description:
      'The swatch palette. Click a swatch to draw with it, upload images of fabric from local device or via URL, or choose colors. Delete swatches and edit the swatch scale.',
    label: 'Palette (p)',
    onClick: toggleTool,
    id: 'palette',
    key: 'p',
  },
  {
    icon: IconGrid4x4,
    name: 'Grid Settings',
    description: 'Change the grid size, visibility, and color.',
    label: 'Grid Settings (g)',
    onClick: toggleTool,
    id: 'gridSettings',
    key: 'g',
  },
  {
    icon: IconZoom,
    name: 'Zoom',
    description: 'Zoom in and out of the canvas.',
    label: 'Zoom (z)',
    onClick: toggleTool,
    id: 'zoom',
    key: 'z',
  },
  {
    icon: IconDeviceFloppy,
    name: 'Save',
    description: 'Save the current pattern to the browser locally to device.',
    label: 'Save Pattern (s)',
    onClick: toggleTool,
    id: 'savePattern',
    key: 's',
  },
  {
    icon: IconUpload,
    name: 'Load',
    description: 'Load a saved pattern from the browser or device.',
    label: 'Load Pattern (l)',
    onClick: toggleTool,
    id: 'loadPattern',
    key: 'l',
  },
  {
    icon: IconTrash,
    name: 'Clear',
    description: 'Clear the canvas.',
    label: 'Clear (c)',
    onClick: toggleTool,
    id: 'clearAll',
    key: 'c',
  },
]
