import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 添加全局样式
import './assets/css/global.css'
// 引入iconfont
import './assets/font/iconfont.css'
// 引入axios
import axios from 'axios'
//  引入echarts同时定义为全局变量
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 挂载axios
Vue.prototype.$http=axios
// 设置跨域的，访问根路径
axios.defaults.baseURL = "http://localhost:9000"
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
