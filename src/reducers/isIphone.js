import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import { INITMOBILE } from '../constants/isIphone'


export default createReducer(fromJS({
  isIphone: false
}),{
  [INITMOBILE]:(state, action) => {
    return state.merge({
      isIphone: action.isIphone
    })
  }
})
