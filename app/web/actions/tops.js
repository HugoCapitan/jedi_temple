import { SELECT_TOP, SELECT_NEW_TOP, DESELECT_ALL_TOPS } from '../constants'

export const deselectAllTops = () => ({
  type: DESELECT_ALL_TOPS
})
export const selectTop = topID => ({
  type: SELECT_TOP,
  topID
})

export const selectNewTop = () => ({
  type: SELECT_NEW_TOP
})

