import { createStore } from 'redux'
import adminApp from './reducers'

const configureStore = () => {
  const store = createStore(adminApp)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(adminApp)
    })
  }

  return store
}

export default configureStore
