import _     from 'lodash'
import axios from 'axios'

import { addCustom } from './customFields'
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

export function requestCustomUpdate (newCustom, oldCustom) {
  return (dispatch, getState) => {
    const token = getState().authToken
    const reqOptions = { headers: { 'Authorization': 'Bearer ' + token } }
    const requests = []
  
    let customToSend = { name: newCustom.name, show: newCustom.show, filter: newCustom.filter }
  
    if (oldCustom.type === 'string') {
      const newValues = _.differenceWith(newCustom.values, oldCustom.values, (newVal, oldVal) => oldVal.value === newVal.value)
      const removedValues = _.differenceWith(oldCustom.values, newCustom.values, (oldVal, newVal) => oldVal.value === newVal.value)
  
      requests.push(
        ...newValues.map(newVal => axios.post(`/api/custom_fields/${oldCustom._id}/values`, newVal, reqOptions)),
        ...removedValues.map(remVal => axios.delete(`/api/custom_fields/${oldCustom._id}/values/${remVal._id}/`, reqOptions))
      )
    } else if (oldCustom.type === 'number') {
      customToSend = { ...customToSend, 
        unit: newCustom.unit, unit_place: newCustom.unit_place, min: newCustom.min, max: newCustom.max 
      }
    }
  
    requests.push( axios.put(`/api/custom_fields/${oldCustom._id}/`, customToSend, reqOptions) )
  
    return Promise.all(requests)
      .then(
        responses => axios.get(`/api/custom_fields/${oldCustom._id}/`, reqOptions),
        error => dispatch(failedRequest('Product Update Failed'))
      )
      .then(
        response => {
          dispatch(updateCustom(response.data))
          dispatch(finishRequest('Custom Updated'))
          dispatch(closeSettingsDialog())
        },
        error => dispatch(failedRequest('Please Reload the window'))
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
    const update    = formatProductToSend(newProduct)

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


function formatProductToSend(product) { 
  delete product.created_at
  delete product.slug
  delete product.store
  delete product.updated_at
  delete product.__v

  return product
}
