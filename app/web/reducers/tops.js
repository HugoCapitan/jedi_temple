import { REQUEST_TOPS, RECEIVE_TOPS, SELECT_TOP, SELECT_NEW_TOP } from '../constants'

const initialState = {
  isFetching: false,
  items: [],
  selected: undefined,
  newSelected: false
}

function tops (state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOPS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_TOPS:
      return {
        ...state,
        items: action.items.reduce((acc, top) => ({...acc, [top._id]: top }), {})
      }
    case SELECT_TOP:
      return {
        ...state,
        selected: state.items[action.topID]
      }
    case SELECT_NEW_TOP:
      return {
        ...state,
        newSelected: true,
        selected: undefined
      }
    default:
      return state
  }
}

export default tops
