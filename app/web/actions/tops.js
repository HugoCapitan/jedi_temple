import { SELECT_TOP, SELECT_NEW_TOP } from '../actions'

export const selectTop = id => ({
  type: SELECT_TOP,
  id
})

export const selectNewTop = () => ({
  type: SELECT_NEW_TOP
})

