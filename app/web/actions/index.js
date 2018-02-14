import axios from 'axios'
import { 
  SET_AUTH_TOKEN, 
  TOGGLE_DRAWER, 
  CHANGE_DRAWER_OPEN, 
  REQUEST_PRODUCTS, 
  RECEIVE_PRODUCTS,
  FAILED_REQUEST
} from '../constants'

export const setAuthToken = token =>({
  type: SET_AUTH_TOKEN,
  token
})

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})

export const changeDrawerOpen = open => ({
  type: CHANGE_DRAWER_OPEN,
  open
})

export const requestProducts = () => ({
  type: REQUEST_PRODUCTS
})

export const receiveProducts = products => ({
  type: RECEIVE_PRODUCTS,
  products
})

export const failedRequest = error => ({
  type: FAILED_REQUEST,
  error
})

export const fetchProducts = token => dispatch => {
  dispatch(requestProducts())
  return axios.get('/api/products', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(
      response => dispatch(receiveProducts(response.data)),
      error => dispatch(failedRequest('error on request'))
    )
}
