import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};
export function getMenuListData(){
    return axios.get('/in/menu/list')
}

export function getMenuSaveData(data){
    return axios.post('/in/menu/save',data,config)
}

export function getMenuUpdateDataInfo(data){
    return axios.get('/in/menu/info/'+data)
}


export function getMenuUpdateData(data){
    return axios.post('/in/menu/update',data,config)
}


export function getMenuDeleteData(data){
    return axios.post('/in/menu/delete/'+data,{},config)
}