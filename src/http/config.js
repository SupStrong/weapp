import Taro from "@tarojs/taro";

import envConfig from './env.js'
import { INITUSER } from '../constants/userInfo'

let status = false
let token = ''
let lock = false
export default class Http {
    get(url, data) {
        return this.commonHttp('GET', url, data)
    }
    post(url, data) {
        return this.commonHttp('POST', url, data)
    }
    async commonHttp(method, url, data) {
        Taro.addInterceptor(this.interceptor)
        return new Promise(async(resolve, reject) => {
            Taro.showNavigationBarLoading()
            try {
                const res = await Taro.request({
                    url: envConfig.baseUrl + url,
                    method,
                    data,
                    header: {
                        token: token,
                        appid: envConfig.appid,
                        Accept: envConfig.Accept
                    }
                })
                Taro.hideNavigationBarLoading()
                switch (res.statusCode) {
                    case 200:
                        return resolve(res.data)
                    default:
                        reject(new Error(res.data.msg))
                }
            } catch (error) {
                Taro.hideNavigationBarLoading()
                reject(new Error('网络请求出错'))
            }
        })
    }
    async interceptor(chain) {
        const requestParams = chain.requestParams
        const {
            url,
            header
        } = requestParams
        let haveToken = header.token || false
        if (!haveToken && !status) {
            status = true
            lock = true
            let tokenData = await asyncToken()
            header.token = tokenData.data.data.token
            token = tokenData.data.data.token
            // tokenData.data.data.unionid = '' 
            Taro.$store.dispatch({ type: INITUSER, userInfo: tokenData.data.data });
        }
        if (lock && !url.includes('/token')) {
            await checkLock()
            header.token = token
        }
        if (typeof(requestParams.data) != 'undefined') { //加unionid
            if ('unionid' in requestParams.data ) {
                if(requestParams.data.unionid.length == 0){
                    requestParams.data.unionid = Taro.$store.getState().userInfo.toJS().userInfo.unionid
                }
            }
        }

        return chain.proceed(requestParams)
            .then(res => {
                return res
            })
    }
}


// 获取微信登录凭证
export const wxLogin = async() => {
    try {
        const res = await Taro.login()

        return res.code
    } catch (error) {}
}
export const asyncToken = async() => {
    let code
    let { scene } = Taro.getLaunchOptionsSync()

    if (scene == 1154) {
        status = false
        lock = false
       return  { data: { data: { token: '',unionid:'' } } }
    } else {
        code = await wxLogin()
    }

    try {
        await Taro.checkSession()
        const tokenData = await Taro.request({
            url: `${envConfig.baseUrl}auth/token`,
            method: 'POST',
            data: {
                code: code
            },
            header: {
                appid: envConfig.appid,
                Accept: envConfig.Accept
            }
        })
        status = false
        lock = false
        return tokenData
    } catch (error) {
        status = false
        lock = false
        // let tokenData = await asyncToken()
        // return tokenData
        return { data: { data: { token: '' } } }
    }
}


const checkLock = async() => {
    return new Promise((resolve) => {
        let a = setInterval(() => {
            if (lock == false) {
                resolve()
                clearInterval(a)
            }
        }, 500)

    })
}