import { 
  CHANGE_DRAWER_OPEN, 
  CLOSE_ITEM_DIALOG,
  CLOSE_SETTINGS_DIALOG,
  FAILED_REQUEST,
  FINISH_REQUEST,
  OPEN_ITEM_DIALOG,
  OPEN_SETTINGS_DIALOG,
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
  settingsDialog: {
    open: false,
    category: ''
  },
  requestError: null,
  route: 'kampamocha'
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    case CLOSE_ITEM_DIALOG:
      return { ...state, itemDialog: {
        open: false,
        itemClass: '',
        itemID: ''
      } }
    case CLOSE_SETTINGS_DIALOG:
      return { ...state, settingsDialog: {
        open: false,
        category: ''
      } }
    case FAILED_REQUEST: 
      return { ...state, isRequestOngoing: false, requestError: action.message }
    case FINISH_REQUEST:
      return { ...state, isRequestOngoing: false }
    case OPEN_ITEM_DIALOG:
      return { ...state, itemDialog: { 
        open: true,
        itemClass: action.itemClass,
        itemID: action.itemID,
      } }
    case OPEN_SETTINGS_DIALOG:
      return { ...state, settingsDialog: {
        open: true,
        category: action.category
      } }
    case START_REQUEST: 
      return { ...state, isRequestOngoing: true }
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    
    default:
      return state
  }
}

export default ui
