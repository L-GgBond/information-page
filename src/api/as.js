import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestAssListData(current, size,uid,rid,kid){
    return axios.get('/ass/list?current='+ current +"&size=" + size + "&uid=" + uid + "&bid=" + rid +  "&kid=" + kid)
}



export function RequestTasklistListData(current, size,uid,kid){
    return axios.get('/task/tasklist?current='+ current +"&size=" + size + "&uid=" + uid  +  "&kid=" + kid)
}