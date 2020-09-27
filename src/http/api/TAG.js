import Http from '../config'


const http = new Http()

//获取标签列表
export const  API_GROUP_LIST =  (data) => http.get(`group/list`, data)


//修改问题标签
export const  API_TAG_SAVE =  (data) => http.post(`tag/save`,data)