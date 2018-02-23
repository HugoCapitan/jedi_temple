import { 
  CHANGE_DRAWER_OPEN,
  CHANGE_SECTION,
  CLOSE_ITEM_DIALOG,
  CLOSE_SETTINGS_DIALOG,
  FAILED_REQUEST,
  FINISH_REQUEST,
  OPEN_ITEM_DIALOG,
  OPEN_SETTINGS_DIALOG,
  START_REQUEST,
  TOGGLE_DRAWER
} from '../constants'


export const changeDrawerOpen = open => ({
  type: CHANGE_DRAWER_OPEN,
  open
})

export const changeSection = section =>({
  type: CHANGE_SECTION,
  section
})

export const closeItemDialog = () => ({
  type: CLOSE_ITEM_DIALOG
})

export const closeSettingsDialog = () => ({
  type: CLOSE_SETTINGS_DIALOG
})

export const failedRequest = message => ({
  type: FAILED_REQUEST,
  message
})

export const finishRequest = message => ({
  type: FINISH_REQUEST,
  message
})

export const openItemDialog = (itemClass, itemID) => ({
  type: OPEN_ITEM_DIALOG,
  itemClass,
  itemID
})

export const openSettingsDialog = (category) => ({
  type: OPEN_SETTINGS_DIALOG,
  category
})

export const startRequest = () => ({
  type: START_REQUEST
})

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})
