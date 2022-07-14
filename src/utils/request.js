import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 90000000000 // 超时时间
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ----加请求头
  // 但是并不是所有的请求都需要token所以要先判断是否需要token
  const token = store.state.user.token
  // token超时--主动介入
  if (token) {
    const time = Date.now() - getTime()
    if (time > 2 * 60 * 60 * 1000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么--响应的数据有错误就直接抛出异常
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // 捕获的错误信息
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 对响应错误做点什么
  // token超时--被动处理
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  return Promise.reject(error)
})
export default request
