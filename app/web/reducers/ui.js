import { 
  CHANGE_DRAWER_OPEN,
  CHANGE_SECTION,
  CLOSE_ITEM_DIALOG,
  FAILED_REQUEST,
  FINISH_REQUEST,
  OPEN_ITEM_DIALOG,
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
    case CLOSE_ITEM_DIALOG:
      return { ...state, itemDialog: {
        open: false,
        itemClass: '',
        itemID: ''
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
    case START_REQUEST: 
      return { ...state, isRequestOngoing: true }
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    
    default:
      return state
  }
}

export default ui
