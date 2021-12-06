import Vue from 'vue'
import Vuex from 'vuex'

import router from '../router/index'

// para decodificar el jwt
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    usuarioDB: '',
  },
  mutations: {
    obtenerUsuario (state, payload){
      state.token = payload;
      if(payload === '') {
        state.usuarioDB = '';
      } else {
        state.usuarioDB = decode(payload);
        router.push({name: 'Home'});
      }
    }
  },
  actions: {
    guardarUsuario({commit}, payload){
      localStorage.setItem('token', payload);
      commit('obtenerUsuario', payload);
    },
    cerrarSesion({commit}){
      commit('obtenerUsuario','');
      localStorage.removeItem('token');
      router.push({name: 'login'});
    },
    leerToken({commit}){
      const token = localStorage.getItem('token');
      if(token){
        commit('obtenerUsuario', token);
      } else {
        commit('obtenerUsuario', '');
      }
    },
  },
  modules: {
  },
  getters: {
    estaActivo: state => !!state.token,
    isTeacher: state => state.usuarioDB.data.role === 'TEACHER',
    isAdmin: state => state.usuarioDB.data.role === 'ADMIN',
    getUsername: state => {
      if(state.usuarioDB){
        return state.usuarioDB.data.nombre+" "+state.usuarioDB.data.apellidos
      } else {
        return ''
      }
    }
  }
})
