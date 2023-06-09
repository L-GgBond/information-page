import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function getUserListData(current,size,types){
    return axios.get('/in/user/list?current='+current+"&size="+size+"&types="+types)
}

export function getUserSaveData(data){
    return axios.post('/in/user/save',data,config)
}

export function getUserUpdateDataInfo(id){
    return axios.get('/in/user/info/'+id)
}

export function getUserUpdateData(data){
    return axios.post('/in/user/update',data,config)
}

export function getUserDeleteData(id){
    return axios.post('/in/user/delete',id,config)
}


export function getUserRole(id,data){
    return axios.post('/in/user/role/'+id,data,config)
}

export function getUserClass(){
    return axios.get('/class/userclass')
}