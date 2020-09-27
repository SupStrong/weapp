import Http from '../config'


const http = new Http()

//获取常用搜索
export const  API_HOT =  (data) => http.get(`article/hot`, data)


//获取搜索列表
export const  API_ARTICLE_LIST =  (data) => http.get(`article/list`, data)


//获取文章详情
export const  API_DES =  (data) => http.get(`article/show/${data.id}`,data)


//操作收藏
export const  API_ARTICLE_OPREATE =  (data) => http.post(`article/opreate`,data)