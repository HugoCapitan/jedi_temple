import { 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST,
  OPEN_ITEM_DIALOG,
  TOGGLE_DRAWER
} from '../constants'


export const changeDrawerOpen = open => ({
  type: CHANGE_DRAWER_OPEN,
  open
})

export const failedRequest = error => ({
  type: FAILED_REQUEST,
  error
})

export const openItemDialog = (itemClass, itemID) => ({
  type: OPEN_ITEM_DIALOG,
  itemClass,
  itemID
})

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})
