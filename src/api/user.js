import axios from "~/utils/request"

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function getUserListData(){
    return axios.get('/in/user/list')
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
