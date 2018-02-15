import { 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST,
  OPEN_ITEM_DIALOG,
  TOGGLE_DRAWER
} from '../constants'

const initialState = {
  route: 'kampamocha',
  drawerOpen: false,
  fetchingError: null,
  itemDialog: {
    open: false,
    itemClass: '',
    itemID: ''
  }
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    case FAILED_REQUEST: 
      return { ...state, fetchingError: action.error }
    case OPEN_ITEM_DIALOG:
      return { ...state, itemDialog: { 
        open: true,
        itemClass: action.itemClass,
        itemID: action.itemID,
      } }
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    
    default:
      return state
  }
}

export default ui
