import Vue from 'vue';
import Vuex from 'vuex';

import router from './router';

import api from './services/api';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    auth: null
  },
  getters: {
    isAuthorized: state => {
      return !!state.auth
    }
  },
  mutations: {
    auth_request(state){
      state.status = 'loading';
    },
    auth_success(state, auth){
      state.status = 'success';
      state.auth = auth;

      router.push({ name: 'dashboard' }).catch(e => {
        console.log(e);
      });
    },
    auth_error(state){
      state.status = 'error';
    },
    logout(state){
      state.status = '';
      state.auth = null;
    },
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');

        api.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify(user)
        }).then(response => {
          if (!response.Authorization) {
            throw new Error("Unable to authenticate.");
          }

          let auth = response.Authorization;
          localStorage.setItem('auth', auth);

          commit('auth_success', auth);

          resolve(response);
        }).catch(e => {
          commit('auth_error');

          localStorage.removeItem('auth');

          reject(e);
        })
      })
    },
    logout({commit}) {
      localStorage.removeItem('auth');

      commit('logout');
    }
  }
});

export default store;