import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/router'
import './utils/rem.js'

Vue.config.productionTip = false
// console.log(Vue.axios)
// Vue.axios.get("http://jsonplaceholder.typicode.com/posts")
// .then(res=>{
//   console.log(res)
// })
// .catch(err=>{
//   console.log(err)
// })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
