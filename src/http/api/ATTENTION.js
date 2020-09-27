import Http from '../config'


const http = new Http()

//关注问题列表
export const API_ATTENTION_QUESTION_LIST = (data) => http.get(`attention/question/list`, data)




//操作---关注
export const API_ATTENTION = (data) => http.post(`attention`, data)