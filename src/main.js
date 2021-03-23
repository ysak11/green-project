import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/js/iconfont.js'
import message from 'components/message'

Vue.config.productionTip = false;

//安装消息插件
Vue.use(message);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
