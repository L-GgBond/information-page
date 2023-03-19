import axios from '~/utils/request'
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function login(username,password,types){
    return axios.post("/dologin",{
        username,
        password,
        types
    },config)
}

// export function login(username,password,types){
//     return axios.post("/login",{
//         username,
//         password,
//         types
//     })
// }

export function logout(){
    return axios.post("/logout")
}

export function getinfo(){
    return axios.get("/in/menu/nav")
}

export function getUserInfo(){
    return axios.get("/in/userInfo")
}

export function updatePassword(data){
    return axios.post("/in/user/updatePass",data,config)
}