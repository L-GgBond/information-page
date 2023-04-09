import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestKmListData(current, size,uid,rid){
    return axios.get('/km/list?current='+ current +"&size=" + size + "&uid=" + uid + "&bid=" + rid)
}

export function RequestKmListDatas(uid){
    return axios.get('/class/lists?&uid=' + uid)
}


export function RequestKmSaveData(data){
    return axios.post('/class/save', data,config)
}

export function RequestKmInfoData(id){
    return axios.get('/class/info/' + id)
}


export function RequestKmUpdateData(data){
    return axios.post('/class/update', data,config)
}


export function RequestKmDeleteData(id,uid){
    return axios.post('/class/delete/'+ id, {uid:uid}, config)
}
