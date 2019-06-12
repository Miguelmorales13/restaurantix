<template>
  <div id="Orders">
    <v-toolbar flat class="elevation-5">
      <v-toolbar-title>Ordenes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small color="secondary" class="mb-2" @click="getOrdersForce" :loading="loader" :disabled="loader">
        <v-icon>list</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn small color="primary" class="mb-2" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <FormOrder @cancel="handleAction"></FormOrder>
      </v-dialog>
      <v-dialog
        v-model="dialogDelete"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >z
        <DeleteOrder @cancel="dialogDelete = false"></DeleteOrder>
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
    <ListOrders @actionList="handleAction" :search="search"></ListOrders>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { App } from "@/Helpers/Globales";
import FormOrder from "./orders/FormOrder.vue";
import ListOrders from "./orders/ListOrders.vue";
import DeleteOrder from "./orders/DeleteOrder.vue";
export default {
  name: "Orders",
  components: { FormOrder, ListOrders, DeleteOrder },
  computed: {
    ...mapState(["shopActive"]),
    ...mapState('orders',['orders','loader'])
  },
  mounted() {
    this.getOrders();
    this.getMenus();
    this.getTables();
  },
  watch: {
    dialog(d){
      if (!d) {
        this.setOrder()
      }
    },
    dialogDelete(d){
      if (!d) {
        this.setOrder()
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
    ...mapActions({
      getOrders: "orders/getAll",
      getOrdersForce: "orders/getForce",
      getMenus: "menus/getAll",
      getTables: "tables/getAll"
    }),
    ...mapMutations("orders", {
      setOrder: "SET"
    }),
    activeForm() {
      this.dialog = true;
    },
    handleAction(action) {
      if (!action) {
        this.dialog = false;
        return
      }
      this.setOrder(action.item);
      if (action.type === "update") {
        this.dialog = true;
      } else {
        this.dialogDelete = true;
      }
    }
  }
};
</script>
<style lang="scss">
#Orders {
  v-toolbar-title {
    width: 100%;
  }
  width: 100%;
}
</style>
