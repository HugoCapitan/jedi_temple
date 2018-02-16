import _     from 'lodash'
import axios from 'axios'

import { receiveProducts, requestProducts, updateProduct } from './products'
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

export const requestProductUpdate = (oldProduct, newProduct) => (dispatch, getState) => {
  const token = getState().authToken
  const customsReqs = []
  const removedCustoms = _.differenceWith(oldProduct.customs, newProduct.customs, (oldVal, newVal) => 
    oldVal.custom_id == newVal.custom_id
  )
  const addedCustoms = _.differenceWith(newProduct.customs, oldProduct.customs, (newVal, oldVal) => 
    oldVal.custom_id == newVal.custom_id
  )
  const modifiedCustoms = newProduct.customs.filter(newCustom => 
    oldProduct.customs.find(oldCustom => newCustom.custom_id == oldCustom.custom_id && newCustom.value != oldCustom.value)
  )
  const productToSend = { name: newProduct.name, price: newProduct.pricem, stock: newProduct.stock, description: newProduct.description }
  
  dispatch(startRequest())
  
  customsReqs.push(axios.put(`/api/products/${oldProduct._id}/`, productToSend, {
    headers: { 'Authorization': 'Bearer ' + token }
  }))
  
  for (const removed of removedCustoms) {
    customsReqs.push(
      axios.delete(`/api/products/${oldProduct._id}/customs/${removed._id}/`, {
        headers: { 'Authorization': 'Bearer ' +  token }
      })
    )
  }

  for (const added of addedCustoms) {
    customsReqs.push(
      axios.post(`/api/products/${oldProduct._id}/customs/`, added, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
    )
  }

  for (const modified of modifiedCustoms) {
    customsReqs.push(
      axios.put(`/api/products/${oldProduct._id}/customs/${modified._id}/`, modified, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
    )
  }

  return Promise.all(customsReqs)
    .then(
      response => {
        dispatch(updateProduct(newProduct))
        dispatch(finishRequest('Product Updated'))
      },
      error => dispatch(failedRequest('Product Update Failed'))
    )
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
