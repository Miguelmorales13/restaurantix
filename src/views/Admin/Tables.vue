<template>
  <div id="Tables">
    <v-toolbar flat class="elevation-5">
      <v-toolbar-title>Mesas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small color="secondary" class="mb-2" @click="getTablesForce" :loading="loader" :disabled="loader">
        <v-icon>list</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn small color="primary" class="mb-2" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <FormTable @cancel="handleAction"></FormTable>
      </v-dialog>
      <v-dialog
        v-model="dialogDelete"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <DeleteTable @cancel="dialogDelete = false"></DeleteTable>
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
    <ListTables @actionList="handleAction" :search="search"></ListTables>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { App } from "@/Helpers/Globales";
import FormTable from "./tables/FormTable.vue";
import ListTables from "./tables/ListTables.vue";
import DeleteTable from "./tables/DeleteTable.vue";
export default {
  name: "Tables",
  components: { FormTable, ListTables, DeleteTable },
  computed: {
    ...mapState(["shopActive"]),
    ...mapState('tables',['users','loader'])
  },
  mounted() {
    this.getTables();
  },
  watch: {
    dialog(d){
      if (!d) {
        this.setTable()
      }
    },
    dialogDelete(d){
      if (!d) {
        this.setTable()
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
    ...mapActions("tables", {
      getTables: "getAll",
      getTablesForce: "getForce"
    }),
    ...mapMutations("tables", {
      setTable: "SET"
    }),
    activeForm() {
      this.dialog = true;
    },
    handleAction(action) {
      if (!action) {
        this.dialog = false;
        return
      }
      this.setTable(action.item);
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
#Tables {
  v-toolbar-title {
    width: 100%;
  }
  width: 100%;
}
</style>
