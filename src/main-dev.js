// import Vue from 'vue'
import App from './App.vue'

// import ElementUI from 'element-ui'
// import axios from 'axios'
// 导入elementui样式
// import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入路由
import router from './routers/index.js'
// 导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器组件及样式
import QuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 导入进度条NProgress
// import NProgress from 'nprogress'
// 打入NProgress样式
// import 'nprogress/nprogress.css'

Vue.config.productionTip = false
// Vue.prototype.$message = ElementUI.Message
// Vue.use(ElementUI)
Vue.use(QuillEditor)

Vue.component('tree-table',TreeTable)

// axios.defaults.baseURL = 'http://127.0.0.1:5000'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 配置请求拦截器
axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return config
})
axios.interceptors.response.use(config=>{
    NProgress.done()
    return config
})

Vue.prototype.$http = axios

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')
