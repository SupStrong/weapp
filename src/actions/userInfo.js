import {
    INITUSER,
} from '../constants/userInfo'


export const initUser = (userInfo) => {
    return {
        type: INITUSER,
        userInfo
    }
}