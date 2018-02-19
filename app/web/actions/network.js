import _     from 'lodash'
import axios from 'axios'

import { addProduct, receiveProducts, removeProduct, requestProducts, updateProduct } from './products'
import { failedRequest, finishRequest, startRequest, closeItemDialog } from './ui'

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

export const requestAddProduct = newProduct => (dispatch, getState) => {
  const token = getState().authToken

  dispatch(startRequest())
  return axios.post('/api/products/', newProduct, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(
    response => {
      dispatch(addProduct(response.data))
      dispatch(finishRequest('Product Saved'))
      dispatch(closeItemDialog())
    },
    error => dispatch(failedRequest('Error adding product'))
  )
}

export const requestProductUpdate = (newProduct, oldProduct) => (dispatch, getState) => {
  const token = getState().authToken
  const reqOptions = { headers: { 'Authorization': 'Bearer ' + token } }
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
  const productToSend = { name: newProduct.name, price: newProduct.price, stock: newProduct.stock, description: newProduct.description }
  
  dispatch(startRequest())

  customsReqs.push( axios.put(`/api/products/${oldProduct._id}/`, productToSend, reqOptions) )
  
  for (const removed of removedCustoms) {
    customsReqs.push( axios.delete(`/api/products/${oldProduct._id}/customs/${removed._id}/`, reqOptions) )
  }

  for (const added of addedCustoms) {
    customsReqs.push( axios.post(`/api/products/${oldProduct._id}/customs/`, added, reqOptions) )
  }

  for (const modified of modifiedCustoms) {
    customsReqs.push( axios.put(`/api/products/${oldProduct._id}/customs/${modified._id}/`, modified, reqOptions) )
  }

  return Promise.all(customsReqs)
    .then(
      responses => axios.get(`/api/products/${oldProduct._id}/`, reqOptions),
      error => dispatch(failedRequest('Product Update Failed'))
    )
    .then(
      response => {
        dispatch(updateProduct(response.data))
        dispatch(finishRequest('Product Updated'))
        dispatch(closeItemDialog())
      },
      error => dispatch(failedRequest('Please Reload the window'))
    )
}

export const requestProductRemove = productID => (dispatch, getState) => {
  const token = getState().authToken

  dispatch(startRequest())
  return axios.delete(`/api/products/${productID}`, { 
    headers: {'Authorization': 'Bearer ' + token } 
  })
  .then(
    removed => {
      dispatch(removeProduct(productID))
      dispatch(finishRequest('Product Removed'))
    }
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
