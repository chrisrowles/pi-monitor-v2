import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import router from '@/router';
import api from '@/services/api';

const store = new Vuex.Store({
  state: {
    token: null
  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token){
      state.status = 'success';
      state.token = token;

      router.push({ name: 'dashboard' }).catch(e => {
        console.log(e);
      });
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        api.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify(user)
        }).then(response => {
          let token = response.Authorization;
          localStorage.setItem('token', token);
          commit('auth_success', token)
          resolve(response)
        }).catch(e => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(e)
        })
      })
    }
  }
})

export default store;