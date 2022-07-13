import Vue from 'vue'
// 使不同浏览器样式渲染的效果保持一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// element-ui依赖包
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 全局公共样式
import '@/styles/index.scss' // global css

import App from './App'
// vuex
import store from './store'
// 路由
import router from './router'
// 图标
import '@/icons' // icon
// 权限控制
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
//  mock假数据不需要就移除
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 控制台生产提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
