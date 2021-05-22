<template>
  <div id="Admin">
    <v-navigation-drawer v-model="drawer" fixed app class="elevation-5">
      <v-list dense class>
        <template v-for="(item, i) in items">
          <v-layout v-if="item.heading" :key="i" row align-center>
            <span v-if="item.click ==='tema'">&nbsp;Tema</span>
            <v-flex xs12 class="text-xs-right">
              <v-btn v-if="item.click ==='adios'" small flat @click="logout">Cerrar sesion</v-btn>
              <v-btn
                v-if="item.click ==='tema'"
                small
                :color="theme==='false'?'black':'white'"
                @click="changeTheme"
              >{{theme==='false'?'Negro':'Blanco'}}</v-btn>
            </v-flex>
          </v-layout>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
          <v-list-tile v-else-if="item.condition" :key="i" @click="goPage(item.path)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark app fixed>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5">{{ app }}&nbsp;</span>
      <v-spacer></v-spacer>
      <v-select
        v-if="isSuperSu"
        flat
        solo
        v-model="shop"
        :items="shops"
        item-text="name"
        item-value="_id"
      ></v-select>
      <div v-else>{{getAnyUser('_shop.name')}}</div>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import { App } from "@/Helpers/Globales";
import * as io from "socket.io-client";
import { mapState, mapActions, mapMutations } from "vuex";
import { isSuperSu, logout, getAnyUser } from "@/Helpers/TokenValid";
import { urlServer } from "@/Helpers/Globales";
export default {
  name: "Admin",
  computed: {
    ...mapState(["shopActive", "theme"]),
    ...mapState("shops", ["shops"])
  },
  mounted() {
    if (isSuperSu()) {
      this.getShops();
    }
    this.socket = io(urlServer,{serveClient: false,});
    this.socket.on( `menus/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addM );
    this.socket.on( `menus/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateM );
    this.socket.on(`menus/delete`, this.deleteM);
    this.socket.on( `categories/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addC );
    this.socket.on( `categories/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateC );
    this.socket.on(`categories/delete`, this.deleteC);
    this.socket.on( `orders/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addO );
    this.socket.on( `orders/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateO );
    this.socket.on(`orders/delete`, this.deleteO);
    this.socket.on( `tables/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addT );
    this.socket.on( `tables/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateT );
    this.socket.on(`tables/delete`, this.deleteT);
  },
  watch: {
    shopActive(shop) {
      this.shop = shop;
      this.socket.on( `menus/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addM );
      this.socket.on( `menus/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateM );
      this.socket.on(`menus/delete`, this.deleteM);
      this.socket.on( `categories/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addC );
      this.socket.on( `categories/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateC );
      this.socket.on(`categories/delete`, this.deleteC);
      this.socket.on( `orders/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addO );
      this.socket.on( `orders/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateO );
      this.socket.on(`orders/delete`, this.deleteO);
      this.socket.on( `tables/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/add`, this.addT );
      this.socket.on( `tables/${ isSuperSu() ? this.shopActive : this.getAnyUser("_shop._id") }/update`, this.updateT );
      this.socket.on(`tables/delete`, this.deleteT);
    },
    shop(shop) {
      this.setShop(shop);
    }
  },
  data: () => ({
    socket: "",
    getAnyUser: getAnyUser,
    app: App,
    shop: "",
    isSuperSu: isSuperSu(),
    drawer: null,
    items: [
      { icon: "home", text: "Inicio", path: "inicioAdmin", condition: true },
      { icon: "face", text: "Usuarios", path: "usuarios", condition: true },
      {
        icon: "chrome_reader_mode",
        text: "Categorias de menu",
        path: "categorias",
        condition: true
      },
      { icon: "cake", text: "Menu", path: "menus", condition: true },
      { icon: "kitchen", text: "Mesas", path: "mesas", condition: true },
      { icon: "fastfood", text: "Ordenes", path: "ordenes", condition: true },
      {
        icon: "shop_two",
        text: "Tiendas",
        path: "tiendas",
        condition: isSuperSu()
      },
      { divider: true },
      { heading: "Cerrar sesion", click: "adios" },
      { heading: "Tema", click: "tema" }
    ]
  }),
  methods: {
    logout() {
      logout();
      this.$router.push({ name: "login" });
    },
    ...mapActions("shops", {
      getShops: "getAll"
    }),
    ...mapMutations({
      setShop: "SET_SHOP",
      setTheme: "SET_THEME"
    }),
    ...mapMutations("orders", {
      addO: "ADD",
      updateO: "UPDATE",
      deleteO: "REMOVE"
    }),
    ...mapMutations("categories", {
      addC: "ADD",
      updateC: "UPDATE",
      deleteC: "REMOVE"
    }),
    ...mapMutations("tables", {
      addT: "ADD",
      updateT: "UPDATE",
      deleteT: "REMOVE"
    }),
    ...mapMutations("menus", {
      addM: "ADD",
      updateM: "UPDATE",
      deleteM: "REMOVE"
    }),
    goPage(page) {
      if (this.$route.name !== page) {
        this.$router.push({ name: page });
      }
    },
    changeTheme() {
      this.setTheme(this.theme === "false" ? true : false);
    }
  },
  props: {
    source: String
  }
};
</script>
<style lang="scss">
#Admin {
  .v-navigation-drawer__border {
    display: none;
  }
  router-link {
    text-decoration: none;
  }
}
</style>
