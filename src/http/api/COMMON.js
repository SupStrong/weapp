import Http from '../config'


const http = new Http()

/**
 * 获取oss配置信息
 * @param {Object} 
 */
export const API_OSSINFO = (data) => http.post(`oss`, data)

/**
 * 上传图片
 * @param {Object} 
 */
export const API_UPLOAD = (data) => http.post(`upload`, data)


/**
 * 城市列表
 * @param {Object} 
 */
export const API_CITY = () => http.get(`region/list`)

/**
 * 订阅模板消息
 * @param {Object} 
 */
export const API_SUBSCRIBE = (data) => http.post(`subscriber/minipro`, data)