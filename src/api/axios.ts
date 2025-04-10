
import axiosClient from "axios"

 const axios = axiosClient.create({
    baseURL: import.meta.env.VITE_URL,
    withCredentials: true
})



axios.interceptors.request.use(config => {

    return config
})

export default axios