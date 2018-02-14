import { SET_AUTH_TOKEN, TOGGLE_DRAWER, CHANGE_DRAWER_OPEN } from '../constants'

export function setAuthToken(token) {
  return {
    type: SET_AUTH_TOKEN,
    token
  }
}

export function toggleDrawer() {
  return {
    type: TOGGLE_DRAWER
  }
}

export function changeDrawerOpen(open) {
  return {
    type: CHANGE_DRAWER_OPEN,
    open
  }
}
