import { SELECT_TOP, SELECT_NEW_TOP } from '../actions'

export const selectTop = topID => ({
  type: SELECT_TOP,
  topID
})

export const selectNewTop = () => ({
  type: SELECT_NEW_TOP
})

