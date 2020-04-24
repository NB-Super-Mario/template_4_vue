const state = {
  keepAlive: true,
};

const getters = {
  getAlive: (state: { keepAlive: any }) => state.keepAlive,
};

const actions = {
  updateAlive({ commit }: any, data: any) {
    commit('UPDATEALIVE', data);
  },
};

const mutations = {
  UPDATEALIVE(state: { keepAlive: any }, data: any) {
    state.keepAlive = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
