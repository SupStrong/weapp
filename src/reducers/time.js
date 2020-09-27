import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import { ADD, MINUS, INIT } from '../constants/time'


export default createReducer(fromJS({
  time: 8500000
}),{
  [INIT]:(state, action) => {
    return state.merge({
      time: action.time
    })
  },
  [ADD]: (state) => {
    const counterState = state.toJS()
    return state.merge({
      time: counterState.time + 1
    })
  },
  [MINUS]: (state) => {
    const counterState = state.toJS()
    return state.merge({
      time: counterState.time - 1
    })
  }
})
