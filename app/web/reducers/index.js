import { combineReducers } from 'redux'

import authToken    from './authToken'
import customFields from './customFields'
import hmProducts   from './hmProducts'
import messages     from './messages'
import orders       from './orders' 
import pictures     from './pictures'
import products     from './products'
import reservations from './reservations'
import stores       from './stores'
import texts        from './texts'
import ui           from './ui'

const adminApp = combineReducers({
  authToken,
  customFields,
  hmProducts,
  messages,
  orders,
  pictures,
  products,
  reservations,
  stores,
  texts,
  ui
})

export default adminApp
