import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestListData(current, size, types, nickname,uid){
    return axios.get('/student/list?current='+ current +"&size=" + size + "&types=" + types + "&nickname=" + nickname+"&uid="+uid )
}

export function RequestSaveData(data){
    return axios.post('/student/save', data)
}

export function RequestInfoData(id){
    return axios.get('/student/info/' + id)
}


export function RequestUpdateData(data){
    return axios.post('/student/update', data)
}


export function RequestDeleteData(id){
    return axios.post('/student/delete/'+ id, {}, config)
}

export function RequestClassListData(id){
    return axios.get('/student/classlist/'+id)
}

export function RequestRoleListData(){
    return axios.get('/student/rolelist')
}

