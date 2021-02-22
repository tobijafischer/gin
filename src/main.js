import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css'
import './assets/css/main.css'
import checkView from 'vue-check-view';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.use(checkView);