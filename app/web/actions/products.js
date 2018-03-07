import {
  ADD_PRODUCT,
  RECEIVE_PRODUCTS,
  REMOVE_PRODUCT,
  REQUEST_PRODUCTS, 
  SELECT_PRODUCT,
  SELECT_NEW_PRODUCT,
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

export const selectProduct = productID => ({
  type: SELECT_PRODUCT,
  productID
})

export const selectNewProduct = () => ({
  type: SELECT_NEW_PRODUCT
})

export const updateProduct = product => ({
  type: UPDATE_PRODUCT,
  product
})
