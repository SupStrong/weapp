import Http from '../config'


const http = new Http()

//工长个人信息详情
export const API_USER_SHOW = (data) => http.get(`user/show/${data.id}`, data)

//工长认证
export const API_USER_CREAT = (data) => http.post(`user/create`, data)

//获取我的提问列表
export const API_USER_QUESTION = (data) => http.get(`user/question/${data.id}`, { page: data.page })

//我的关注工长列表
export const API_USER_ATTENTION_LIST = (data) => http.get(`user/attention-person`, data)

//我的回答
export const API_USER_ANSWER = (data) => http.get(`user/answer/${data.id}`, { unionid: data.unionid, page: data.page })