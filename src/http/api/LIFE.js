import Http from '../config'


const http = new Http()

/**
 * 获取生命周期
 * @param {Object} 
 */
export const API_LIFE_TIME = (data) => http.get(`life/time`,data)

/**
 * 时间操作
 * @param {Object} data {type:1=>点击搜索 2=>收藏 3=>分享 4=>彩蛋,opreate_type:incr | desc,unionid:用户ID}
 */

export const API_LIFE_OPREATE = (data) => http.post(`life/opreate`, data)