import axios from 'axios'
import { toast } from '~/utils/common'
import { getToken } from '~/utils/auth'
import store from "~/store"

const http = axios.create({
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    baseURL:'/api',
    timeout:8000
})
 
// 添加请求拦截器
http.interceptors.request.use(function (config) {
    const token = getToken()
    if(token){
        config.headers["authorization"] = token
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  if(response.data.code == 400){
    toast(response.data.msg,"error")
  }
  store.commit('SET_Authorization',response.headers.authorization)
  return response.request.responseType == "blob" ? response.data : response.data;

}, function (error) {
  const msg = error.response.data.msg || "请求失败"
  console.log('error',error)
  // if(msg == "非法token，请先登录！"){
  //   store.dispatch("logout").finally(()=>location.reload())
  // }

  toast(msg,"error")
  return Promise.reject(error);
})

export default http
