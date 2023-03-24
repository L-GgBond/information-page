import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function getRoleListData(current,size){
    return axios.get('/in/role/list?current='+ current +"&size=" + size)
}


export function getRoleSaveData(data){
    return axios.post('/in/role/save',data,config)
}

export function getRoleUpdateDataInfo(id){
    return axios.get('/in/role/info/'+id)
}


export function getRoleUpdateData(data){
    return axios.post('/in/role/update',data,config)
}


export function getRoleDeleteData(id){
    return axios.post('/in/role/delete',id,config)
}
