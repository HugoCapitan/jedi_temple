import { RECEIVE_CUSTOMFIELDS, REQUEST_CUSTOMFIELDS } from '../constants'

const initialState = {
  isFetching: false,
  items: {}
}

function customFields (state = initialState, action) {
  switch (action.type) {
    case REQUEST_CUSTOMFIELDS:
      return {...state, isFetching: true}
    case RECEIVE_CUSTOMFIELDS: 
      return {
        ...state,
        isFetching: false,
        items: action.items.reduce((acc, product) => ({...acc, [product._id]: product }), {})
      }
    default:
      return state
  }
}

export default customFields
