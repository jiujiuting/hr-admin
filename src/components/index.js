import PageTool from './PageTool'
import UploadImage from './UploadImage'
export default {
  // install 必须有 插件的写法
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
  }
}
