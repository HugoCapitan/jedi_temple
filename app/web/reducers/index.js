import { combineReducers } from 'redux'

import { SET_AUTH_TOKEN } from '../constants'

function authToken (state = '', action) {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return action.token
    default:
      return state
  }
}

function customFields (state = [], action) {
  switch (action.type) {
    default:
      return state
  }
}

const adminApp = combineReducers({
  authToken,
  customFields
})

export default adminApp
