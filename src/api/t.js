import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestListData(current, size,uid){
    return axios.get('/task/list?current='+ current +"&size=" + size +"&uid=" + uid)
}
