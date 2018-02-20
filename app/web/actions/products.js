import {
  ADD_PRODUCT,
  RECEIVE_PRODUCTS,
  REMOVE_PRODUCT,
  REQUEST_PRODUCTS, 
  UPDATE_PRODUCT
} from '../constants'

export const addProduct = product => ({
  type: ADD_PRODUCT,
  product
})

export const removeProduct = productID => ({
  type: REMOVE_PRODUCT,
  productID
})

export const updateProduct = product => ({
  type: UPDATE_PRODUCT,
  product
})
