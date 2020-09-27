import { combineReducers } from 'redux'
import counter from './counter'
import time from './time'
import userInfo from './userInfo'
import isIphone from './isIphone'

export default combineReducers({
  counter,
  time,
  userInfo,
  isIphone
})
