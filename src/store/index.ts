import Vuex from 'vuex';
import Vue from 'vue';
import permissions from './modules/permissions';
import treeCollection from './modules/treeCollection';
import keep from './modules/keepAlive';

const debug = process.env.NODE_ENV !== 'production';
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    tree: treeCollection,
    permissions,
    keep,
  },
  strict: debug,
  plugins: [],
});
