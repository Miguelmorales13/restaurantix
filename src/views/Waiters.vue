<template lang="Waiters">
  <div class="">
    <v-toolbar color="primary" dark tabs >
      <v-toolbar-title> {{app}} <span>({{shopActive}})</span> </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn v-show="false" icon v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <FormOrder @cancel="dialog=false"></FormOrder>
      </v-dialog>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-tile  @click="adios"  >
            <v-list-tile-title>Cerrar sesión</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="changeTheme"  >
            <v-list-tile-title>Tema: {{theme==='false'?'Negro':'Blanco'}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <template v-slot:extension>
        <v-tabs v-model="currentItem" color="transparent" fixed-tabs slider-color="yellow">
          <v-tab v-for="item in items" :key="item.title" :href="`#tab-${item.title}`"> {{ item.title }} </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="currentItem">
      <v-tab-item value="tab-Ordenes" >
        <OrdersWaiter @goOrder="goOrder"></OrdersWaiter>
      </v-tab-item>
      <v-tab-item value="tab-Menu" >
        <MenuWaiter></MenuWaiter>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>

import { getAnyUser, logout } from '@/Helpers/TokenValid';
import FormOrder from '@/views/Admin/orders/FormOrder';
import OrdersWaiter from './Waiters/OrdersWaiter';
import MenuWaiter from './Waiters/MenuWaiter';
import { App } from '@/Helpers/Globales';
import * as io from 'socket.io-client';
import { mapActions,mapMutations, mapState } from 'vuex';
import { urlServer } from '@/Helpers/Globales';
export default {
  name:"Waiters",
  components: {
    FormOrder,MenuWaiter,OrdersWaiter
  },
  computed:{
    ...mapState('orders',['orders']),
    ...mapState(['theme']),
  },
  mounted() {
    this.io.on(`menus/${this.getAnyUser('_shop._id')}/add`, this.addM)
    this.io.on(`menus/${this.getAnyUser('_shop._id')}/update`, this.updateM)
    this.io.on(`menus/delete`,this.deleteM)
    this.io.on(`orders/${this.getAnyUser('_shop._id')}/add`, this.addO)
    this.io.on(`orders/${this.getAnyUser('_shop._id')}/update`, data=>{
      if (data.status==='Terminada') {
        this.deleteO(data)
      }else{
        this.updateO(data)
      }
    })
    this.io.on(`orders/delete`, this.deleteO)
    this.io.on(`tables/${this.getAnyUser('_shop._id')}/add`, this.addT )
    this.io.on(`tables/${this.getAnyUser('_shop._id')}/update`, this.updateT)
    this.io.on(`tables/delete`, this.deleteT)
    this.io.on('disconnect', () => {
     this.disconnect++;
    })
    this.io.on('reconnect', () => {
      if (this.disconnect>0) {
        this.getTables()
        this.getOrders()
        this.disconnect=0
      }
    })
    this.getTables()
    this.getMenus()
    this.getOrders()
  },
  data: ()=>({
    disconnect:0,
    app:App,
    shopActive:getAnyUser('_shop.name'),
    dialog:false,
    getAnyUser:getAnyUser,
    io:io(urlServer),
    currentItem: 'tab-Ordenes',
    items: [
      {
      title:'Ordenes',
      component:OrdersWaiter
    },
      {
      title:'Menu',
      component:MenuWaiter
    }
    ],
  }),
  methods: {
    changeTheme(){
      this.setTheme(this.theme==='false'?true:false)
    },
    adios(){
      logout()
      this.$router.push({ name: "login" })
    },
    goOrder(order){
      this.setOrder(order)
      this.dialog=true
    },
    activeForm() {
      this.dialog = true;
    },
    ...mapMutations({
      setTheme:'SET_THEME'
    }),
    ...mapMutations('orders',{
      addO:'ADD',
      setOrder:'SET',
      updateO:'UPDATE',
      deleteO:'REMOVE',
    }),
    ...mapMutations('tables',{
      addT:'ADD',
      updateT:'UPDATE',
      deleteT:'REMOVE',
    }),
    ...mapMutations('menus',{
      addM:'ADD',
      updateM:'UPDATE',
      deleteM:'REMOVE',
    }),
    ...mapActions('tables',{
      getTables:'getForce'
    }),
    ...mapActions('menus',{
      getMenus:'getForce'
    }),
    ...mapActions('orders',{
      getOrders:'getInProcess'
    }),
  }
}
</script>

<style lang="scss" scoped>
</style>
