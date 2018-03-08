import { REQUEST_ORDERS, RECEIVE_ORDERS } from '../constants'

const initialState = {
  isFetching: false,
  items: []
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
    default:
      return state
  }
}

export default orders
