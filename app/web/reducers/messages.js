import { REQUEST_MESSAGES, RECEIVE_MESSAGES, SELECT_MESSAGE } from '../constants'

const initialState = {
  isFetching: false,
  items: [],
  selected: undefined
}

function messages (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MESSAGES:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_MESSAGES:
      return {
        ...state,
        items: action.items.reduce((acc, message) => ({...acc, [message._id]: message }), {})
      }
    case SELECT_MESSAGE:
      return {
        ...state,
        selected: state.items[action.messageID]
      }
    default:
      return state
  }
}

export default messages
