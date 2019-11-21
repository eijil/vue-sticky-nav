import Vue from 'vue'
import App from './App.vue'

import VueRandomColor from 'vue-randomcolor'

Vue.use(VueRandomColor)
new Vue({
  el: '#app',
  render: h => h(App)
})
