import { TOGGLE_DRAWER, CHANGE_DRAWER_OPEN } from '../constants'

const initialState = {
  drawerOpen: false
}

const uiDrawer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    default:
      return state
  }
}

export default uiDrawer
