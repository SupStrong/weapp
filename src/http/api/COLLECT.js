import Http from '../config'


const http = new Http()

//获取收藏列表
export const  API_COLLECT_LIST =  (data) => http.get(`collect/list`, data)


//获取搜索列表
export const  list =  (data) => http.get(`article/list`, data)


//获取关注问题列表
export const  API_AttentionQList =  (data) => http.get(`user/attention-question`, data)

//关注/
export const  API_ATTENTION =  (data) => http.post(`attention`, data)


//点赞/
export const  API_AGREE =  (data) => http.post(`agree`, data)