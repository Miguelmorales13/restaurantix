<template>
  <v-app id="app" :dark="theme==='false'?false:true">
    <router-view></router-view>
  </v-app>
</template>
<script>

import { getTheme } from "@/Helpers/Globales";
import { mapState, mapMutations } from 'vuex';

export default {
  name:'App',
  computed:{
    ...mapState(['theme']),
    
  },
  mounted(){
    this.setTheme(getTheme())
    
  },
  methods:{
    ...mapMutations({
      setTheme:'SET_THEME'
    })
  }
  
}
</script>

<style lang="scss">
#app {
  overflow: auto;
  .v-btn {
    min-width: auto;
  }
}
</style>

