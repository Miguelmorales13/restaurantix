<template>
  <div id="Shops">
    <v-toolbar flat class="elevation-5">
      <v-toolbar-title>Tiendas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small color="secondary" class="mb-2" @click="getShopsForce" :loading="loader" :disabled="loader">
        <v-icon>list</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn small color="primary" class="mb-2" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <FormShop @cancel="handleAction"></FormShop>
      </v-dialog>
      <v-dialog
        v-model="dialogDelete"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <DeleteShop @cancel="dialogDelete = false"></DeleteShop>
      </v-dialog>
    </v-toolbar>
    <v-text-field
      v-model="search"
      small
      class="pt-0"
      append-icon="search"
      label="Buscar"
      single-line
      hide-details
    ></v-text-field>
    <ListShops @actionList="handleAction" :search="search"></ListShops>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { App } from "@/Helpers/Globales";
import FormShop from "./shops/FormShop.vue";
import ListShops from "./shops/ListShops.vue";
import DeleteShop from "./shops/DeleteShop.vue";
export default {
  name: "Shops",
  components: { FormShop, ListShops, DeleteShop },
  computed: {
    ...mapState(["shopActive"]),
    ...mapState('shops',['shops','loader'])
  },
  mounted() {
    this.getShops();
  },
  watch: {
    dialog(d){
      if (!d) {
        this.setShop()
      }
    },
    dialogDelete(d){
      if (!d) {
        this.setShop()
      }
    }
  },
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    app: App
  }),
  methods: {
    ...mapActions("shops", {
      getShops: "getAll",
      getShopsForce: "getForce"
    }),
    ...mapMutations("shops", {
      setShop: "SET"
    }),
    activeForm() {
      this.dialog = true;
    },
    handleAction(action) {
      if (!action) {
        this.dialog = false;
        return
      }
      this.setShop(action.item);
      if (action.type === "update") {
        this.dialog = true;
      } else {
        this.dialogDelete = true;
      }
    },
  }
};
</script>
<style lang="scss">
#Shops {
  v-toolbar-title {
    width: 100%;
  }
  width: 100%;
}
</style>
