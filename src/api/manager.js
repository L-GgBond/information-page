import axios from '~/utils/request'

//登陆
export function login(username,password,type){
    return axios.post("/login",{
        username,
        password,
        type
    })
}

//退出登陆
export function logout(){
    return axios.post("/logout")
}