import Vue from 'vue'
import Vuex from 'vuex'

import router from './router'

// para decodificar el jwt
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    token: '',
    usuarioDB: '',
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) { state.barImage = payload },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    obtenerUsuario (state, payload) {
      state.token = payload
      if (payload === '') {
        state.usuarioDB = ''
      } else {
        state.usuarioDB = decode(payload)
        router.push({ name: 'Dashboard' })
      }
    },
  },
  actions: {
    guardarUsuario ({ commit }, payload) {
      localStorage.setItem('token', payload)
      commit('obtenerUsuario', payload)
    },
    cerrarSesion ({ commit }) {
      commit('obtenerUsuario', '')
      localStorage.removeItem('token')
      router.push({ name: 'Icons' })
    },
    leerToken ({ commit }) {
      const token = localStorage.getItem('token')
      if (token) {
        commit('obtenerUsuario', token)
      } else {
        commit('obtenerUsuario', '')
      }
    },
  },
  getters: {
    estaActivo: state => !!state.token,
    isTeacher: state => state.usuarioDB.data.role === 'TEACHER',
    isAdmin: state => state.usuarioDB.data.role === 'ADMIN',
    getUsername: state => {
      if (state.usuarioDB) {
        return state.usuarioDB.data.nombre + ' ' + state.usuarioDB.data.apellidos
      } else {
        return ''
      }
    },
  },
})
