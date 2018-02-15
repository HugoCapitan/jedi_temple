import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS, UPDATE_PRODUCT } from '../constants'

const initialState = {
  isFetching: false,
  items: {}
}

function products (state = initialState, action) {
  switch (action.type) {
    case REQUEST_PRODUCTS:
      return {...state, isFetching: true}
    case RECEIVE_PRODUCTS: 
      return {
        ...state,
        isFetching: false,
        items: action.items.reduce((acc, product) => ({...acc, [product._id]: product }), {})
      }
    case UPDATE_PRODUCT: 
      return {
        ...state,
        items: {
          ...state.items,
          [action.product._id]: action.product
        }
      }
    default:
      return state
  }
}

export default products
