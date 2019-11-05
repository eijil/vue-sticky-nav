import Vue from 'vue'
import App from './App.vue'
import VueSticky from 'vue-sticky'
Vue.directive('sticky', VueSticky);
new Vue({
  el: '#app',
  render: h => h(App)
})
