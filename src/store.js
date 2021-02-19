import Vue from 'vue';
import Vuex from 'vuex';

import { url, defaultHeaders } from '@/services/api';
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
    },
    auth_user(state, user){
      state.id = user.user_id;
      state.email = user.email;
      state.created = user.registered_on;
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

        fetch(url + '/auth/login', {
          method: 'POST',
          body: JSON.stringify(user),
          headers: defaultHeaders
        }).then(response => {
          if (!response.ok) {
            commit('auth_error');
            return reject(response.statusText);
          }

          return resolve(response.json());
        });
      });
    },
    verify({commit}, token) {
      let headers = { ...defaultHeaders, ...{
          'Authorization': token,
        }
      };

      fetch(url + '/auth/verify', {
        headers: headers
      }).then(response => {
        if (!response.ok) {
          commit('auth_error');
          throw new Error("Could not verify user.");
        }

        commit('auth_success', token);
        return response.json();
      }).then(user => commit('auth_user', user.data)).catch(()=>{})
    },
    logout({commit}) {
      let headers = { ...defaultHeaders, ...{
          'Authorization': this.state.auth
        }
      };

      fetch(url + '/auth/logout', {
        method: 'POST',
        headers: headers
      }).then(() => commit('logout')).catch(()=>{});
    }
  }
});

export default store;