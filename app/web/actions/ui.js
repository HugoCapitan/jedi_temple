import { 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST,
  OPEN_DIALOG,
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

export const openDialog = (dialog, content) => ({
  type: OPEN_DIALOG,
  dialog,
  content
})

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})
