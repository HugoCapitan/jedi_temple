import { SET_AUTH_TOKEN } from '../constants'

export const setAuthToken = token =>({
  type: SET_AUTH_TOKEN,
  token
})
