import _     from 'lodash'
import axios from 'axios'

import { addCustom, updateCustom, removeCustom } from './customFields'
import { addProduct, removeProduct, updateProduct } from './products'
import { failedRequest, finishRequest, startRequest, closeItemDialog, closeSettingsDialog } from './ui'

export function fetchCollection(collection) {
  return (dispatch, getState) => {
    const token = getState().authToken
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
}

export function requestCustomAdd(newCustom) {
  return (dispatch, getState) => {
    const token = getState().authToken
  
    dispatch(startRequest())
    return axios.post('/api/custom_fields/', newCustom, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(
      response => {
        dispatch(addCustom(response.data))
        dispatch(finishRequest('CustomField Saved'))
        dispatch(closeSettingsDialog)
      },
      error => dispatch(failedRequest('Error saving CustomField'))
    )
  }
}

export function requestCustomRemove(){
  return (dispatch, getState) => {

  }
}

export function requestCustomUpdate (newCustom) {
  return (dispatch, getState) => {
    const token    = getState().authToken
    const customID = newCustom._id
    const update   = formatObjectToSend(newCustom)
    delete update.type
    delete update._values
  
    return axios.put(`/api/custom_fields/${customID}/`, update, { headers: { 'Authorization': 'Bearer ' + token } })
      .then(
        response => {
          dispatch(updateCustom(response.data))
          dispatch(finishRequest('Custom Updated'))
          dispatch(closeSettingsDialog())
        },
        error => dispatch(failedRequest('Failed CustomField update request'))
      )
  }
}

export function requestProductAdd(newProduct) {
  return (dispatch, getState) => {
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
}

export function requestProductRemove(productID) {
  return (dispatch, getState) => {
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
}

export function requestProductUpdate(newProduct) {
  return (dispatch, getState) => {
    const token     = getState().authToken
    const productID = newProduct._id
    const update    = formatObjectToSend(newProduct)

    dispatch(startRequest())
    return axios.put(`/api/products/${productID}/`, update, { headers: { 'Authorization': 'Bearer ' + token } })
      .then(
        response => {
          dispatch(updateProduct(response.data))
          dispatch(finishRequest('Product Updated'))
          dispatch(closeItemDialog())
        },
        error => dispatch(failedRequest('Product Update Failed'))
      )
  }
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

function formatObjectToSend(toSend) { 
  delete toSend.created_at
  delete toSend.slug
  delete toSend.store
  delete toSend.updated_at
  delete toSend.__v

  return toSend
}
