import { SET_AUTH_TOKEN } from '../constants'

function authToken (state = '', action) {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return action.token
    default:
      return state
  }
}

export default authToken
