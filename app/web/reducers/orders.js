import { REQUEST_ORDERS, RECEIVE_ORDERS, SELECT_ORDER } from '../constants'

const initialState = {
  isFetching: false,
  items: [],
  selected: undefined
}

function orders (state = initialState, action) {
  switch (action.type) {
    case REQUEST_ORDERS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_ORDERS:
      return {
        ...state,
        items: action.items.reduce((acc, order) => ({...acc, [order._id]: order }), {})
      }
    case SELECT_ORDER:
      return {
        ...state,
        selected: state.items[action.orderID]
      }
    default:
      return state
  }
}

export default orders
