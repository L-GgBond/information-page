import axios from '~/utils/request'

//登陆
export function login(username,password,types){
    return axios.post("/login",{
        username,
        password,
        types
    })
}

//退出登陆
export function logout(){
    return axios.post("/logout")
}

//菜单
export function getinfo(){
    return axios.get("/in/menu/nav")
}

//用户信息
export function getUserInfo(){
    return axios.get("/in/userInfo")
}
