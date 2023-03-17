import axios from "~/utils/request"

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};



export function getNoticeListData(){
    return axios.get('/notice/list')
}


export function getNoticeSaveData(data){
    return axios.post('/notice/save',data)
}

export function getNoticeUpdateDataInfo(id){
    return axios.get('/notice/info/'+id)
}


export function getNoticeUpdateData(data){
    return axios.post('/notice/update',data)
}


export function getNoticeDeleteData(id){
    return axios.post('/notice/delete/'+id,{},config)
}
