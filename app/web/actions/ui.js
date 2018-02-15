import { 
  CHANGE_DRAWER_OPEN,
  CLOSE_ITEM_DIALOG,
  FAILED_REQUEST,
  FINISH_REQUEST,
  OPEN_ITEM_DIALOG,
  START_REQUEST,
  TOGGLE_DRAWER
} from '../constants'


export const changeDrawerOpen = open => ({
  type: CHANGE_DRAWER_OPEN,
  open
})

export const closeItemDialog = () => ({
  type: CLOSE_ITEM_DIALOG
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

export const startRequest = () => ({
  type: START_REQUEST
})

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})
