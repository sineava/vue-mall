import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'

import './assets/css/global.css'
import './assets/font/iconfont.css'
// 引入ZkTable
import ZkTable from 'vue-table-with-tree-grid'
// 引入v-viewer
import Viewer from 'v-viewer'
// 引入axios
import axios from 'axios'

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入nprogress
import NProgress from 'nprogress'

axios.defaults.baseURL = 'https://renoblog.xyz/api/private/v1/'
// 在request拦截器中显示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.filter('dateFormat', (dateStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dateStr).format(pattern)
})

Vue.config.productionTip = false
Vue.component('tree-table', ZkTable)
Vue.use(Viewer)
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
