import { combineReducers } from 'redux'

import authToken    from './authToken'
import customFields from './customFields'
import hmProducts   from './hmProducts'
import orders       from './orders' 
import pictures     from './pictures'
import products     from './products'
import reservations from './reservations'
import stores       from './stores'
import ui           from './ui'

const adminApp = combineReducers({
  authToken,
  customFields,
  hmProducts,
  orders,
  pictures,
  products,
  reservations,
  stores,
  ui
})

export default adminApp
