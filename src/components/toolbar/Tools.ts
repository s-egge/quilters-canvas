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
    label: 'Draw (d)',
    onClick: setTool,
    id: 'draw',
    key: 'd',
  },
  {
    icon: IconEraser,
    label: 'Erase (e)',
    onClick: setTool,
    id: 'erase',
    key: 'e',
  },
  {
    icon: IconPalette,
    label: 'Palette (p)',
    onClick: toggleTool,
    id: 'palette',
    key: 'p',
  },
  {
    icon: IconGrid4x4,
    label: 'Grid Settings (g)',
    onClick: toggleTool,
    id: 'gridSettings',
    key: 'g',
  },
  {
    icon: IconZoom,
    label: 'Zoom (z)',
    onClick: toggleTool,
    id: 'zoom',
    key: 'z',
  },
  {
    icon: IconDeviceFloppy,
    label: 'Save Pattern (s)',
    onClick: toggleTool,
    id: 'savePattern',
    key: 's',
  },
  {
    icon: IconUpload,
    label: 'Load Pattern (l)',
    onClick: toggleTool,
    id: 'loadPattern',
    key: 'l',
  },
  {
    icon: IconTrash,
    label: 'Clear (c)',
    onClick: toggleTool,
    id: 'clearAll',
    key: 'c',
  },
]
