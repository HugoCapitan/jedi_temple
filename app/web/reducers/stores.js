import { RECEIVE_STORES, REQUEST_STORES } from '../constants'

const initialState = {
  isFetching: false,
  items: [],
  selected: undefined,
  newSelected: false
}

function stores (state = [], action) {
  switch (action.type) {
    case REQUEST_STORES:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_STORES:
      return {
        ...state,
        items: action.items.reduce((acc, store) => ({...acc, [store._id]: store }), {})
      }
    default:
      return state
  }
}

export default stores
