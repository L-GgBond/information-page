import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function RequestListData(current, size){
    return axios.get('/term/list?current='+ current +"&size=" + size)
}


export function RequestSaveData(data){
    return axios.post('/term/save', data)
}

export function RequestInfoData(id){
    return axios.get('/term/info/' + id)
}


export function RequestUpdateData(data){
    return axios.post('/term/update', data)
}


export function RequestDeleteData(id){
    return axios.post('/term/delete/'+ id, {}, config)
}
