import axios from 'axios'
import { receiveProducts, requestProducts } from './products'
import { failedRequest, finishRequest, startRequest } from './ui'

export const fetchCollection = (token, collection) => dispatch => {
  let endpoint = collection
  let url = '/api/'

  if (collection === 'customFields') endpoint = 'custom_fields'
  if (collection === 'hmProducts')   endpoint = 'hm_products'
  url += endpoint

  dispatch(requestCollection(collection))
  return axios.get(url, { headers: { 'Authorization': 'Bearer ' + token } })
    .then(
      response => dispatch(receiveCollection(collection, response.data)),
      error => dispatch(failedRequest(error.response.data.message))
    )
}

export const updateProduct = (newProduct) => (dispatch, getState) => {
  const oldProduct = getState().products.items[newProduct._id]
}

export function requestCollection (collection) {
  return { type: `REQUEST_${collection.toUpperCase()}` }
}

export function receiveCollection (collection, items) {
  return {
    type: `RECEIVE_${collection.toUpperCase()}`,
    items
  }
}