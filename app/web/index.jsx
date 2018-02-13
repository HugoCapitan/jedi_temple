import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import { setAuthToken } from './actions'
import configureStore from './configureStore'

const store = configureStore()
const token = document.getElementById('root').getAttribute('token')
store.dispatch(setAuthToken(token))

const renderApp = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderApp()
  })
}

renderApp()
