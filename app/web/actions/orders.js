import { SELECT_ORDER } from '../constants'


export const selectOrder = orderID => ({
  type: SELECT_ORDER,
  orderID
})
