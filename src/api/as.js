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

export function RequestTaskSaveDataReject(aid,uid,ascontent,filelist,reject){
    return axios.post('/task/rejectsave',{aid:aid,uid:uid,ascontent:ascontent,filelist:filelist,reject:reject},config)
}


export function RequestTasklistListInfoData(aid,uid){
    return axios.get('/task/tasklistinfo?aid='+ aid +"&uid=" + uid ,{} )
}

export function RequestViewsInfoData(aid,uid){
    return axios.get('/task/tasklistinfos?aid='+ aid +"&uid=" + uid ,{} )
}



export function RequestIfViewsInfoData(id,uid){
    return axios.get('/task/taskifview?id='+ id +"&uid=" + uid,{} )
}

export function RequestSubmitAssListData(current, size,aid){
    return axios.get('/ass/submitlist?current='+ current +"&size=" + size + "&aid=" + aid )
}

export function RequestSubmitInfoData(aid,uid){
    return axios.get('/ass/submitlistinfo?aid='+ aid +"&uid=" + uid ,{} )
}


export function RequestSubmitInfoSaveData(id,score){
    return axios.get('/ass/save?id='+ id +"&score=" + score ,{} )
}


export function RequestReject(id,reject){
    return axios.post('/ass/reject',{id:id,reject:reject})
}


export function rejectInfos(id,uid){
    return axios.post('/ass/rejectinfo',{id:id,uid:uid})
}

