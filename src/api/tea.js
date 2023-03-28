import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};



export function RequestListData(current, size, types, nickname,approverid){
    return axios.get('/tea/list?current='+ current +"&size=" + size + "&types=" + types + "&nickname=" + nickname + "&approverid=" + approverid)
}


export function RequestDeleteData(id){
    return axios.post('/tea/delete/'+ id, {}, config)
}

export function RequestInfoData(id){
    return axios.get('/tea/listinfo/' + id)
}