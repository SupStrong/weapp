import {
  ADD,
  MINUS,
  INIT
} from '../constants/time'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}
export const init = (time) => {
  return {
    type: INIT,
    time
  }
}
