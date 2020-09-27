import Http from '../config'


const http = new Http()

//授权
export const  API_AUTH_LOGIN =  (data) => http.post(`auth/authorize`, data)
