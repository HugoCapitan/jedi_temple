import { 
  REQUEST_PRODUCTS, 
  RECEIVE_PRODUCTS 
} from '../constants'

export const requestProducts = () => ({
  type: REQUEST_PRODUCTS
})

export const receiveProducts = products => ({
  type: RECEIVE_PRODUCTS,
  products
})