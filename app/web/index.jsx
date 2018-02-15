import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import App from './components/App'
import { setAuthToken, fetchCollection } from './actions'
import configureStore from './configureStore'

import baseStyles from './styles/base'

const store = configureStore()
const token = document.getElementById('root').getAttribute('token')
store.dispatch(setAuthToken(token))

const MaterialApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

const renderApp = () => {
  render(
    <Provider store={store}>
      <MaterialApp />
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
initData()

function initData () {
  store.dispatch(fetchCollection(token, 'products'))
  store.dispatch(fetchCollection(token, 'customFields'))
}
