import _ from 'lodash'

import { 
  ADD_PRODUCT, 
  RECEIVE_PRODUCTS,
  REMOVE_PRODUCT,
  REQUEST_PRODUCTS,
  UPDATE_PRODUCT 
} from '../constants'

const initialState = {
  isFetching: false,
  items: {}
}

function products (state = initialState, action) {
  switch (action.type) {
    case ADD_PRODUCT:
      return {
        ...state,
        items: { 
          [action.product._id]: action.product,
          ...state.items
        }
      }
    case RECEIVE_PRODUCTS: 
      return {
        ...state,
        isFetching: false,
        items: action.items.reduce((acc, product) => ({...acc, [product._id]: product }), {})
      }
    case REMOVE_PRODUCT:
      return {
        ...state,
        isFetching: false,
        items: _.omit(state.items, [action.productID])
      }
    case REQUEST_PRODUCTS:
      return {...state, isFetching: true}
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
