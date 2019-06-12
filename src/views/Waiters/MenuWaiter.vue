<template>
  <div id="MenuWaiter">
    <v-list two-line subheader>
         <v-subheader inset>Menu de el dia de hoy</v-subheader>

         <v-list-tile
           v-for="menu in getIsActive"
           :key="menu._id"
         >
           <v-list-tile-content>
             <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
             <v-list-tile-sub-title>{{ menu.description }}</v-list-tile-sub-title>
           </v-list-tile-content>

           <v-list-tile-action>
            $ {{menu.price}}
           </v-list-tile-action>
         </v-list-tile>

       </v-list>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: "MenuWaiter",

  computed: {
    ...mapGetters('menus',['getIsActive'])
  },
  data: () => ({

  }),
}
</script>
<style lang="scss" scoped>
</style>
