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

export function RequestTaskSaveData(aid,uid,ascontent,filelist){
    return axios.post('/task/tasksave',{aid:aid,uid:uid,ascontent:ascontent,filelist:filelist},config)
}


export function RequestTasklistListInfoData(aid,uid){
    return axios.get('/task/tasklistinfo?aid='+ aid +"&uid=" + uid ,{} )
}


export function RequestIfViewsInfoData(id){
    return axios.get('/task/taskifview?id='+ id,{} )
}