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
      <Shop></Shop>
    </v-card-text>
  </v-card>
</template>
<script>
import Shop from "./Shop";
import { mapState, mapMutations } from "vuex";
import { Adelete } from "@/Helpers/Api";
import { managementErrors } from "@/Helpers/Globales";

export default {
  name: "DeleteShop",
  components: { Shop },
  computed: {
    ...mapState("shops", ["selectedShop"])
  },
  data: ()=> ({
    petition:false
  }),
  methods: {
    ...mapMutations("shops", {
      deleteShop: "REMOVE"
    }),
    async onDelete() {
      this.petition=true
      try {
        await Adelete("shops", this.selectedShop._id);
        this.deleteShop(this.selectedShop);
        this.$emit("cancel");
      } catch (error) {
        managementErrors(error);
      } finally {
        this.petition=false
      }
    }
  }
};
</script>
