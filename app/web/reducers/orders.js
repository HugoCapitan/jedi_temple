import { REQUEST_ORDERS, RECEIVE_ORDERS } from '../constants'

const initialState = {
  isFetching: false,
  items: []
}

function orders (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ORDERS:
      return {
        ...state,
        isFetching: true
      }
    case REQUEST_ORDERS:
      return {
        ...state,
        items: action.orders.reduce((acc, order) => ({...acc, [order._id]: order }), {})
      }
    default:
      return state
  }
}

export default orders
