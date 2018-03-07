import _ from 'lodash'
import { 
  ADD_CUSTOM, 
  RECEIVE_CUSTOMFIELDS, 
  REMOVE_CUSTOM, 
  REQUEST_CUSTOMFIELDS,
  SELECT_CUSTOM,
  SELECT_NEW_CUSTOM,
  UPDATE_CUSTOM 
} from '../constants'

const initialState = {
  isFetching: false,
  selected: undefined,
  newSelected: false,
  items: {}
}

function customFields (state = initialState, action) {
  switch (action.type) {
    case ADD_CUSTOM: 
      return {...state, items: { 
        [action.custom._id]: action.custom,
        ...state.items 
      }}
    case RECEIVE_CUSTOMFIELDS: 
      return {
        ...state,
        isFetching: false,
        items: action.items.reduce((acc, product) => ({...acc, [product._id]: product }), {})
      }
    case REMOVE_CUSTOM:
      return {
        ...state,
        isFetching: false,
        items: _.omit(state.items, [action.customID])
      }
    case REQUEST_CUSTOMFIELDS:
      return {...state, isFetching: true}
    case SELECT_CUSTOM:
      return {...state,
        newSelected: false,
        selected: state.items[action.customID]
      }
    case SELECT_NEW_CUSTOM:
      return {...state,
        newSelected: true,
        selected: undefined
      }
    case UPDATE_CUSTOM:
      return { ...state, items: {
        ...state.items,
        [action.custom._id]: action.custom
      }}
    default:
      return state
  }
}

export default customFields
