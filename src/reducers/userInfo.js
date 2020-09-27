import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import { INITUSER } from '../constants/userInfo'


export default createReducer(fromJS({
    userInfo: {
        unionid:'',
        token:'' 
    },
}), {
    [INITUSER]: (state, action) => {
        return state.merge({
            userInfo: action.userInfo
        })
    },
})