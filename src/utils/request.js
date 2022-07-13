import axios from 'axios'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 5000 // 超时时间
})

export default request
