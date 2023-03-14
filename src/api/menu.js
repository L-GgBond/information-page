import axios from "~/utils/request"

export function getMenuListData(){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    return axios.get('/in/menu/list')
}

export function getMenuSaveData(data){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    return axios.post('/in/menu/save',data,config)
}


export function getMenuUpdateDataInfo(data){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    return axios.get('/in/menu/info/'+data)
}


export function getMenuUpdateData(data){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    return axios.post('/in/menu/update',data,config)
}


export function getMenuDeleteData(data){
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };
    return axios.post('/in/menu/delete/'+data,{},config)
}