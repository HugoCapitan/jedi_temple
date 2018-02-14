import { 
  TOGGLE_DRAWER, 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST 
} from '../constants'

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})

export const changeDrawerOpen = open => ({
  type: CHANGE_DRAWER_OPEN,
  open
})

export const failedRequest = error => ({
  type: FAILED_REQUEST,
  error
})
