import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import toastr from "toastr";
import "toastr/build/toastr.css";
import "./registerServiceWorker";
import "moment/locale/es";
import moment from "moment";
import { isSuperSu, getAnyUser } from "./Helpers/TokenValid";

Vue.prototype.moment = moment;

toastr.options = {
  closeButton: false,
  newestOnTop: false,
  progressBar: false,
  // positionClass: 'toast-top-right',
  positionClass: "toast-bottom-full-width",
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 2000,
  extendedTimeOut: 1000,
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "slideDown",
  hideMethod: "slideUp"
};
Vue.config.productionTip = false;
Vue.filter("fromNow", value => {
  if (!value) return "";
  return moment(value).fromNow();
});
Vue.filter("sort", (values, type) => {
  if (!values) return [];
  if (type === "asc") {
    return values.sort((a, b) => {
      const aa = new Date(a.createdAt),
        bb = new Date(b.createdAt);
      return aa.getTime() - bb.getTime();
    });
  } else {
    return values.sort((a, b) => {
      const aa = new Date(a.createdAt),
        bb = new Date(b.createdAt);
      return bb.getTime() - aa.getTime();
    });
  }
});
Vue.filter("shop", (values, ...args) => {
  if (!values) return [];
  return values.filter(u => {
    if (!args[0]) return true;
    if (isSuperSu()) {
      return u._shop && u._shop._id && u._shop._id == args[0];
    } else {
      return u._shop._id == getAnyUser("_shop._id");
    }
  });
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
