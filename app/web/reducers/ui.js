import { 
  CHANGE_DRAWER_OPEN,
  CHANGE_SECTION,
  FAILED_REQUEST,
  FINISH_REQUEST,
  START_REQUEST,
  TOGGLE_DRAWER
} from '../constants'

const initialState = {
  drawerOpen: false,
  isRequestOngoing: false,
  itemDialog: {
    open: false,
    itemClass: '',
    itemID: ''
  },
  requestError: null,
  route: 'kampamocha',
  section: 'general'
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    case CHANGE_SECTION:
      return { ...state, section: action.section }
    case FAILED_REQUEST: 
      return { ...state, isRequestOngoing: false, requestError: action.message }
    case FINISH_REQUEST:
      return { ...state, isRequestOngoing: false }
    case START_REQUEST: 
      return { ...state, isRequestOngoing: true }
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    
    default:
      return state
  }
}

export default ui
