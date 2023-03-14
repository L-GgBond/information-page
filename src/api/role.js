import axios from "~/utils/request"

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function getRoleListData(){
    return axios.get('/in/role/list')
}


export function getRoleSaveData(data){
    return axios.post('/in/role/save',data,config)
}

export function getRoleUpdateData(){
    return axios.get('/in/role/list')
}

