import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios)

Vue.use(require('moment'));
Vue.use(require('vue-moment'));

import DatetimePicker from 'vuetify-datetime-picker'
//import 'vuetify-datetime-picker/src/stylus/main.styl'

Vue.use(DatetimePicker)

//Vue.use(vuetify)

//Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'http://localhost:3000/api';
//axios.defaults.baseURL = 'https://jm-caronte.herokuapp.com/api';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
