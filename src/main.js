import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import VueRouter from 'vue-router';
import router from './routes.js'

Vue.use(VueRouter);

new Vue({
  el: '#app',
  render: h => h(App),
  router
})

 Vue.filter('formatDate', function(value) {
    if (value) {
      return moment(String(value)).format('MMM Do YYYY')
    }
  })