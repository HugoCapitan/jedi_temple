import { 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST,
  FINISHED_REQUEST,
  OPEN_ITEM_DIALOG,
  START_REQUEST,
  TOGGLE_DRAWER
} from '../constants'


export const changeDrawerOpen = open => ({
  type: CHANGE_DRAWER_OPEN,
  open
})

export const failedRequest = message => ({
  type: FAILED_REQUEST,
  message
})

export const finishedRequest = message => ({
  type: FINISHED_REQUEST,
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
