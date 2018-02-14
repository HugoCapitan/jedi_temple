import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS } from '../constants'

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
        items: action.products.reduce((acc, product) => ({...acc, [product._id]: product }), {})
      }
    default:
      return state
  }
}

export default products
