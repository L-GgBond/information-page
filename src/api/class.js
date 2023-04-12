import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestListData(current, size,uid){
    return axios.get('/class/list?current='+ current +"&size=" + size+"&uid=" + uid)
}

export function RequestListDatas(uid){
    return axios.get('/class/lists?&uid=' + uid)
}


export function RequestSaveData(data){
    return axios.post('/class/save', data,config)
}

export function RequestInfoData(id){
    return axios.get('/class/info/' + id)
}

export function RequestInfoDataClass(id){
    return axios.get('/class/info/' + id)
}



export function RequestUpdateData(data){
    return axios.post('/class/update', data,config)
}


export function RequestDeleteData(id,uid){
    return axios.post('/class/delete/'+ id, {uid:uid}, config)
}

