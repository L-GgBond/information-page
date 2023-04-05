import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function RequestListData(current, size){
    return axios.get('/subject/list?current='+ current +"&size=" + size)
}

export function RequestSaveData(data){
    return axios.post('/subject/save', data)
}

export function RequestInfoData(id){
    return axios.get('/subject/info/' + id)
}


export function RequestUpdateData(data){
    return axios.post('/subject/update', data)
}


export function RequestDeleteData(id){
    return axios.post('/subject/delete/'+ id, {}, config)
}
