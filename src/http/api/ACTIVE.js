import Http from '../config'


const http = new Http()

//获取抽奖条件
export const  API_ACTIVE_QUALIFICA =  (data) => http.get(`active/qualifica`, data)



//获取黑名单列表
export const  API_ACTIVE_BLOCK =  (data) => http.get(`active/black-person`,data)


//获取排行榜
export const  API_ACTIVE_SORT =  (data) => http.get(`active/person-sort`,data)


//判断活动
export const  API_ACTIVE_INFO =  (data) => http.get(`active/info`,data)
