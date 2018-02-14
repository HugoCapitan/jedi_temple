import axios from 'axios'
import { receiveProducts, requestProducts } from './products'
import { failedRequest } from './ui'

export const fetchProducts = token => dispatch => {
  dispatch(requestProducts())
  return axios.get('/api/products', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(
      response => dispatch(receiveProducts(response.data)),
      error => dispatch(failedRequest('error on request'))
    )
}