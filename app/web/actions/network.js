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

export function requestProductUpdate(newProduct, oldProduct) {
  return (dispatch, getState) => {
    const token = getState().authToken
    const reqOptions = { headers: { 'Authorization': 'Bearer ' + token } }
    const requests = []
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
  
    requests.push( axios.put(`/api/products/${oldProduct._id}/`, productToSend, reqOptions) )
    
    for (const removed of removedCustoms) {
      requests.push( axios.delete(`/api/products/${oldProduct._id}/customs/${removed._id}/`, reqOptions) )
    }
  
    for (const added of addedCustoms) {
      requests.push( axios.post(`/api/products/${oldProduct._id}/customs/`, added, reqOptions) )
    }
  
    for (const modified of modifiedCustoms) {
      requests.push( axios.put(`/api/products/${oldProduct._id}/customs/${modified._id}/`, modified, reqOptions) )
    }
  
    return Promise.all(requests)
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
