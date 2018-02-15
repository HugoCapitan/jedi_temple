import { 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST,
  FINISHED_REQUEST,
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
  route: 'kampamocha'
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    case FAILED_REQUEST: 
      return { ...state, requestError: action.message }
    case FINISHED_REQUEST:
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
