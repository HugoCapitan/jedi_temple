import { ADD_CUSTOM, UPDATE_CUSTOM, REMOVE_CUSTOM } from '../constants'

export const addCustom = custom => ({
  type: ADD_CUSTOM,
  custom
})

export const removeCustom = customID => ({
  type: REMOVE_CUSTOM,
  customID
})

export const updateCustom = custom => ({
  type: UPDATE_CUSTOM,
  custom
})
