import Vue from 'vue'
import App from './App.vue'
import '@babel/polyfill'
import InfiniteScroll from 'vue-infinite-scroll'

Vue.use(InfiniteScroll)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
