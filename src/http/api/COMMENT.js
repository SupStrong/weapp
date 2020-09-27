import Http from '../config'


const http = new Http()

//获取评论列表
export const  API_COMMENT_LIST =  (data) => http.get(`comment/list`, data)


//发送评论
export const  API_COMMENT_SAVE =  (data) => http.post(`comment/save`, data)