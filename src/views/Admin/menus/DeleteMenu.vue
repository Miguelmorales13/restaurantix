<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$emit('cancel')">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Eliminar</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat :disabled="petition" :loading="petition" @click="onDelete">Confirmar</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <h4 class="text-xs-center">Seguro que deseas eliminarlo ?</h4>
      <h5 class="text-xs-center">una vez eliminado no se podra recuperar</h5>
      <br>
      <br>
      <Menu></Menu>
    </v-card-text>
  </v-card>
</template>
<script>
import Menu from "./Menu";
import { mapState } from "vuex";
import { Adelete } from "@/Helpers/Api";
import { managementErrors } from "@/Helpers/Globales";

export default {
  name: "DeleteMenu",
  components: { Menu },
  computed: {
    ...mapState("menus", ["selectedMenu"])
  },
  data: ()=>({
    petition:false
  }),
  methods: {
    async onDelete() {
      this.petition=true
      try {
        await Adelete("menus", this.selectedMenu._id);
        this.$emit("cancel");
      } catch (error) {
        managementErrors(error);
      } finally {
        this.petition=true
      }
    }
  }
};
</script>
