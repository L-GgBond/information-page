import axios from "~/utils/request"
const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export function RequestUploads(file){
    return axios.post('/upload', file)
}