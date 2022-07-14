import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList = ['/login', '/404'] // 白名单
// 前置路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度效果
  // 权限控制
  const token = store.state.user.token
  if (token) { // 已登录
    if (to.path === '/login') {
      NProgress.done() // 关闭进度效果
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        // 当用户手里面有token并且访问的不是登录页面，那就应该请求个人资料
        store.dispatch('user/getInfo')
      }
      next()
    }
  } else { // 未登录
    if (whiteList.includes(to.path)) { // 包含
      next()
    } else {
      NProgress.done() // 关闭进度效果
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach(route => {
  NProgress.done() // 关闭进度效果
})
