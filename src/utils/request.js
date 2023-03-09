import axios from 'axios'
import { toast } from '~/utils/common'
import { getToken } from '~/utils/auth'
import store from "~/store"

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
