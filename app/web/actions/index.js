import { SET_AUTH_TOKEN } from '../constants'

export function setAuthToken(token) {
  return {
    type: SET_AUTH_TOKEN,
    token
  }
}
