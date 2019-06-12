<template>
  <div id="Chefs">
    <v-toolbar color="primary" dark>
      <v-toolbar-title>
        {{app}}
        <span>({{shopActive}})</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-tile @click="adios">
            <v-list-tile-title>Cerrar sesión</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="changeTheme">
            <v-list-tile-title>Tema: {{theme==='false'?'Negro':'Blanco'}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-container fluid grid-list-lg>
      <v-card v-for="(order,i) in orders" mb-2 class="mb-2 elevation-5" :key="i">
        <v-card-title>
          <span>Mesa. {{ order.order._table.number }}</span>
          <v-spacer></v-spacer>
          <v-chip :color="order.new===true?'orange':'indigo'" text-color="white">
            {{order.new===true?'Nuevo':'Agregar a mesa'}}
            <v-icon right>{{order.new===true?'star':'add'}}</v-icon>
          </v-chip>
        </v-card-title>
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex text-xs-center xs12 sm6 v-for="menu in order.order.menu" :key="menu.plate">
              <h3>{{menu.plate | nameMenu(menus)}} &nbsp;&nbsp;| &nbsp;&nbsp; {{menu.cantidad}}</h3>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat @click="setDone(order.order)">Listo</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import * as io from "socket.io-client";
import { urlServer, App, sendNotification } from "@/Helpers/Globales";
import { getAnyUser, logout } from "@/Helpers/TokenValid";
export default {
  name: "Chefs",
  computed: {
    ...mapGetters("orders", {
      orders: "getListComplete"
    }),
    ...mapState(["theme"]),
    ...mapState("menus", ["menus"])
  },
  data: () => ({
    io: io(urlServer),
    app: App,
    shopActive: getAnyUser("_shop.name"),
    getAnyUser: getAnyUser
  }),
  mounted() {
    if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(status => {
        console.log(status);
      });
    }
    this.io.on(`menus/${this.getAnyUser("_shop._id")}/add`, this.addM);
    this.io.on(`menus/${this.getAnyUser("_shop._id")}/update`, this.updateM);
    this.io.on(`menus/delete`, this.deleteM);
    this.io.on(`orders/${this.getAnyUser("_shop._id")}/add`, data => {
      this.addO(data);

      sendNotification("Nueva orden", {
        body: `Nueva orden para la mesa ${data._table.number}`,
        vibrate: [100, 50, 100],
        lang: "es"
      });
    });
    this.io.on(`orders/${this.getAnyUser("_shop._id")}/update`, data => {
      if (data.status === "Terminada") {
        this.deleteO(data);
      } else {
        this.updateO(data);
        sendNotification("Nueva orden", {
          body: `Agregar a la mesa ${data._table.number}`,
          vibrate: [100, 50, 100],
          lang: "es"
        });
      }
    });
    this.io.on(`orders/delete`, this.deleteO);
    this.getOrders();
    this.getMenus();
  },
  methods: {
    changeTheme() {
      this.setTheme(this.theme === "false" ? true : false);
    },
    adios() {
      logout();
      this.$router.push({ name: "login" });
    },
    ...mapMutations("orders", {
      addO: "ADD_CHEF",
      setOrder: "SET",
      setDone: "SET_DONE_CHEF",
      updateO: "UPDATE_CHEF",
      deleteO: "REMOVE_CHEF"
    }),
    ...mapMutations("menus", {
      addM: "ADD",
      updateM: "UPDATE",
      deleteM: "REMOVE"
    }),
    ...mapActions("menus", {
      getMenus: "getForce"
    }),
    ...mapActions("orders", {
      getOrders: "getInProcessChef"
    }),
    ...mapMutations({
      setTheme: "SET_THEME"
    })
  },
  filters: {
    nameMenu(value, ...args) {
      if (!value) return "";
      const menu = args[0].find(m => m._id === value);
      return menu && menu.name ? menu.name : "";
    },
    orderByUpdated(values) {
      return [...values];
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

