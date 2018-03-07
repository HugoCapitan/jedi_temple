import { ADD_CUSTOM, UPDATE_CUSTOM, REMOVE_CUSTOM, SELECT_CUSTOM, SELECT_NEW_CUSTOM } from '../constants'

export const addCustom = custom => ({
  type: ADD_CUSTOM,
  custom
})

export const removeCustom = customID => ({
  type: REMOVE_CUSTOM,
  customID
})

export const selectCustom = customID => ({
  type: SELECT_CUSTOM,
  customID
})

export const selectNewCustom = () => ({
  type: SELECT_NEW_CUSTOM
})

export const updateCustom = custom => ({
  type: UPDATE_CUSTOM,
  custom
})
