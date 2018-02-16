import {
  ADD_PRODUCT,
  REQUEST_PRODUCTS, 
  RECEIVE_PRODUCTS,
  UPDATE_PRODUCT
} from '../constants'

export const addProduct = product => ({
  type: ADD_PRODUCT,
  product
})
 
export const requestProducts = () => ({
  type: REQUEST_PRODUCTS
})

export const receiveProducts = products => ({
  type: RECEIVE_PRODUCTS,
  products
})

export const updateProduct = product => ({
  type: UPDATE_PRODUCT,
  product
})
