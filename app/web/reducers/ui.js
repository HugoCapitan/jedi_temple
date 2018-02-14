import { TOGGLE_DRAWER, CHANGE_DRAWER_OPEN, FAILED_REQUEST } from '../constants'

const initialState = {
  drawerOpen: false,
  fetchingError: null
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    case FAILED_REQUEST: 
      return { ...state, fetchingError: action.error }
    default:
      return state
  }
}

export default ui
