import {
  INITMOBILE
} from '../constants/isIphone'


export const init = (isIphone) => {
  return {
    type: INITMOBILE,
    isIphone
  }
}
