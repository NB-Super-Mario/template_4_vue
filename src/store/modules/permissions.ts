import { permission } from '@/service/api';

const state = {
  permissions: null,
};

const getters = {
  permissions: (state: { permissions: any }) => state.permissions,
};

const actions = {
  updatePermissions({ commit }: any, sys: any) {
    permission.getPermissionForButton(sys).then((data: any) => {
      commit('UPDATEPERMISSION', data);
    });
  },
};

const mutations = {
  UPDATEPERMISSION(state: { permissions: any }, permissions: any) {
    state.permissions = permissions;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
