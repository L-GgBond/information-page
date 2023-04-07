import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestListData(current, size,uid){
    return axios.get('/class/list?current='+ current +"&size=" + size+"&uid=" + uid)
}


export function RequestSaveData(data){
    return axios.post('/class/save', data)
}

export function RequestInfoData(id){
    return axios.get('/class/info/' + id)
}


export function RequestUpdateData(data){
    return axios.post('/class/update', data)
}


export function RequestDeleteData(id){
    return axios.post('/class/delete/'+ id, {}, config)
}
