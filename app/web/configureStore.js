import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import adminApp from './reducers'

const loggerMiddleware = createLogger()

const configureStore = () => {
  const store = createStore(
    adminApp,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(adminApp)
    })
  }

  return store
}

export default configureStore
