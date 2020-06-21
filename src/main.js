// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Store from './store'
import filters from './utils/filter'

// 页面打印
import Print from 'vue-print-nb'
// import pagePrint from '@/plugs/print'

// moment.js
// import Moment from 'moment'
// Vue.filter('moment',function(data,format){
//   return Moment(data).format(format)
// })

// 导出excel表格
// import Blob from './vendor/Blob'
// import Export2Excel from './vendor/Export2Excel.js' 

// 导出excel表格
// import Blob from './vendor/Blob'
// import Export2Excel from './vendor/Export2Excel.js'

// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// css
import './assets/css/normalize.css'
import './assets/less/common.less'
import './assets/less/theme.less'
import './assets/font-awesome-4.7.0/css/font-awesome.min.css'
import './assets/iconfont/iconfont.css'
import VCharts from 'v-charts'

// echarts
import echarts from 'echarts'
//
import Video from 'video.js'
import 'video.js/dist/video-js.css'

// vedio播放器
import VueVideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import 'videojs-contrib-hls'

// 富文本框
import VueEditor from 'vue2-editor'
import 'vue2-editor/dist/vue2-editor.css'
import 'quill/dist/quill.snow.css'

// 引入全局函数 COS对象相关API
import globalFun from './utils/global_fun.js'
// Vue.use(clientMqtt)
// 引入自定义指令实现el-dialog拖拽
import './directives.js'

// flv
import flv from 'flv'
Vue.prototype.$echarts = echarts

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$video = Video
Vue.use(VueVideoPlayer)
Vue.use(VueEditor)
// // 引入全局函数 MQTT
// import clientMqtt from './utils/clientMqtt.js';

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(globalFun)
Vue.use(Vuex)
Vue.use(VCharts)
Vue.use(flv)
Vue.use(Print)
// Vue.use(pagePrint)

const store = new Vuex.Store({
  modules: Store
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
