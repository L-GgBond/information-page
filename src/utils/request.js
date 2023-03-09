import axios from 'axios'
import { toast } from '~/util/common'
import { getToken } from '~/util/auth'
 
const http = axios.create({
    baseURL:'/api',
    timeout:8000
})
 
// 添加请求拦截器
http.interceptors.request.use(function (config) {

    // 往header头自动添加token
    const token = getToken()
    if(token){
        config.headers["token"] = token
    }

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


export default http
