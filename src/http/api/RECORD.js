import Http from '../config'


const http = new Http()

//获取感谢列表
export const  API_RECORD =  (data) => http.get(`record`, data)

