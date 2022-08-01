import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), // 取
  userInfo: {}
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state) {
    state.token = null
    removeToken() // 清除
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    // 发起登录请求
    const res = await login(data)
    context.commit('setToken', res)
    setToken(res) // 存
    setTime(Date.now())
  },
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res
  },
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    // 把vuex中的permission/routes;清空一下
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action可以将commit的第三个参数设置成{root:true}就表示当前的context不是子模块了而是父模块
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

