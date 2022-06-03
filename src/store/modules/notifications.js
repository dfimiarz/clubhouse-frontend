const state = {
  //Notification format {"id":Number,"text":String,"type":String}
  notification: null,
};

const mutations = {
  ADD_NOTIFICATION(state, newNotification) {
    state.notification = {
      id: newNotification.id,
      text: newNotification.text,
      type: newNotification.type,
    };
  },
  REMOVE_NOTIFICATION(state) {
    state.notification = null;
  },
};

const actions = {
  addNotification({ commit }, { text, type }) {
    commit("ADD_NOTIFICATION", {
      id: new Date().getTime(),
      text: text,
      type: type,
    });

    return true;
  },
  removeNotification({ commit }) {
    commit("REMOVE_NOTIFICATION");
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
