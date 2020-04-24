const state = {
  treeCollection: [],
};

const getters = {
  treeCollection: (state: { treeCollection: any }) => state.treeCollection,
};

const actions = {
  updateTreeCollection({ commit }: any, treeCollection: any) {
    commit('ADDTREE', treeCollection);
  },
  removeTreeCollection({ commit }: any) {
    commit('REMOVETREE');
  },
};

const mutations = {
  ADDTREE(state: { treeCollection: any[] }, treeCollection: any) {
    state.treeCollection.push(treeCollection);
  },
  REMOVETREE(state: { treeCollection: { length: number } }) {
    state.treeCollection.length = 0;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
