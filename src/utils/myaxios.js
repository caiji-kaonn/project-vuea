import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
export default axios

// axios设置请求拦截器
axios.interceptors.request.use(config => {
  let mytoken = localStorage.getItem('itcast_sp_manager')
  if (mytoken) {
    config.headers.Authorization = mytoken
  }
  return config
}, err => {
  return Promise.reject(err)
})
