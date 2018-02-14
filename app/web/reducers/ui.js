import { 
  CHANGE_DRAWER_OPEN, 
  FAILED_REQUEST,
  OPEN_DIALOG,
  TOGGLE_DRAWER
} from '../constants'

const initialState = {
  drawerOpen: false,
  fetchingError: null,
  productDialog: {
    title: '',
    open: false,
    content: {}
  }
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DRAWER_OPEN: 
      return { ...state, drawerOpen: action.open }
    case FAILED_REQUEST: 
      return { ...state, fetchingError: action.error }
    case OPEN_DIALOG:
      return { ...state, [action.dialog]: { 
        open: true, 
        content: action.content ? action.content : {}, 
        title: action.content ? 'New Product' : 'Edit Product'
      } }
    case TOGGLE_DRAWER: 
      return { ...state, drawerOpen: !state.drawerOpenopen }
    
    default:
      return state
  }
}

export default ui
