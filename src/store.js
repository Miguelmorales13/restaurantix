import Vue from "vue";
import Vuex from "vuex";
import users from "./Vuex/users";
import shops from "./Vuex/shops";
import tables from "./Vuex/tables";
import menus from "./Vuex/menus";
import orders from "./Vuex/orders";
import categories from "./Vuex/categories";
Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    shopActive: "",
    theme: 'false'
  },
  mutations: {
    SET_SHOP(state, shop) {
      state.shopActive = shop ? shop : "";
    },
    SET_THEME(state, theme) {
      state.theme = String(theme)
      localStorage.setItem('theme', theme)
    }
  },
  actions: {},
  modules: {
    users,
    shops,
    tables,
    menus,
    orders,
    categories
  }
});
