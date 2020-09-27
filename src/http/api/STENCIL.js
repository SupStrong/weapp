import Http from '../config'


const http = new Http()


//获取模版列表
export const  API_STENCIL_LIST =  (data) => http.get(`stencil`, data)

//获取模版详情
export const  API_STENCIL_DES =  (data) => http.get(`stencil/show/${data.id}`)