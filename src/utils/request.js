import axios from 'axios'
 
 
export const http = axios.create({
    baseURL:'',
    timeout:8000,
 
})
 
export default{
    http,
    install(app){
        app.config.globalProperties.$http = http
    }
}
