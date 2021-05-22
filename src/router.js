import Vue from "vue";
import Router from "vue-router";
import Users from "./views/Admin/Users.vue";
import Shops from "./views/Admin/Shops.vue";
import Menus from "./views/Admin/Menus.vue";
import Tables from "./views/Admin/Tables.vue";
import Orders from "./views/Admin/Orders.vue";
import Categories from "./views/Admin/Categories.vue";
import HomeAdmin from "./views/Admin/HomeAdmin.vue";
import PageNoFound from "./views/PageNoFound.vue";
import { getAnyUser, isValidToken, getToken } from '@/Helpers/TokenValid';
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "Login" */ "./views/Login.vue"),
      beforeEnter: (to, from, next) => {
        if (isValidToken(getToken()) && (getAnyUser('rol') === 'Super administrador' || getAnyUser('rol') === 'Administrador')) {
          next({name:'admin'})
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Mesero') {
          next({name:'mesero'})
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Cocinero') {
          next({name:'cocinero'})
        } else {
          next()
        }
      }
    },
    {
      path: "/cocinero",
      name: "cocinero",
      component: () =>
        import(/* webpackChunkName: "Chefs" */ "./views/Chefs.vue"),
      beforeEnter: (to, from, next) => {
        if (isValidToken(getToken()) && (getAnyUser('rol') === 'Super administrador' || getAnyUser('rol') === 'Administrador')) {
          next({name:'admin'})
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Mesero') {
          next({name:'mesero'})
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Cocinero') {
          next()
        } else {
          next({name:'login'})
        }
      }
    },
    {
      path: "/mesero",
      name: "mesero",
      component: () =>
        import(/* webpackChunkName: "Waiters" */ "./views/Waiters.vue"),
      beforeEnter: (to, from, next) => {
        if (isValidToken(getToken()) && (getAnyUser('rol') === 'Super administrador' || getAnyUser('rol') === 'Administrador')) {
          next({name:'admin'})
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Mesero') {
          next()
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Cocinero') {
          next({name:'cocinero'})
        } else {
          next({name:'login'})
        }
      }
    },
    {
      path: "/admin",
      name: "admin",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/Admin.vue"),
      beforeEnter: (to, from, next) => {
        if (isValidToken(getToken()) && (getAnyUser('rol') === 'Super administrador' || getAnyUser('rol') === 'Administrador')) {
          next()
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Mesero') {
          next({name:'mesero'})
        } else if (isValidToken(getToken()) && getAnyUser('rol') === 'Cocinero') {
          next({name:'cocinero'})
        } else {
          next({name:'login'})
        }
      },
      children: [
        {
          path: "",
          name: 'inicioAdmin',
          component: HomeAdmin
        },
        {
          path: "usuarios",
          name: "usuarios",
          component: Users
        },
        {
          path: "categorias",
          name: "categorias",
          component: Categories
        },
        {
          path: "tiendas",
          name: "tiendas",
          component: Shops
        },
        {
          path: "mesas",
          name: "mesas",
          component: Tables
        },
        {
          path: "menus",
          name: "menus",
          component: Menus
        },
        {
          path: "ordenes",
          name: "ordenes",
          component: Orders
        }
      ]
    },
    {
      path: '**',
      name: 'PageNoFound',
      component: PageNoFound
    }
  ]
});

export default router
