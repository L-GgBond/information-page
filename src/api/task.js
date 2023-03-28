import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};


export function RequestTermListData(){
    return axios.get('/task/termlist')
}

export function RequestSubjectListData(){
    return axios.get('/task/subjectlist')
}

export function RequestTeacherListData(){
    return axios.get('/task/teacherlist')
}

export function RequestTaskSaveData(data){
    return axios.post('/task/tasksave', data,config)
}


export function RequestListData(current, size, types, nickname,uid){
    return axios.get('/task/tasklist?current='+ current +"&size=" + size + "&types=" + types + "&nickname=" + nickname + "&uid=" + uid)
}


export function RequestDeleteData(id){
    return axios.post('/task/listdelete/'+ id, {}, config)
}

export function RequestInfoData(id){
    return axios.get('/task/tasklistinfo/' + id)
}



export function RequestSaveData(data){
    return axios.post('/student/save', data)
}



export function RequestUpdateData(data){
    return axios.post('/student/update', data)
}



export function RequestClassListData(){
    return axios.get('/student/classlist')
}

export function RequestRoleListData(){
    return axios.get('/student/rolelist')
}

