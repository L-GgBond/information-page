import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

//获取当前 是否有未提交的作业
export function RequestGetNumberData(uid){
    return axios.get('/index/index/' + uid,{},config)
}
