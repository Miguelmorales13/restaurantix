<template>
  <div id="Categories">
    <v-toolbar flat class="elevation-5">
      <v-toolbar-title>Categorias</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        small
        color="secondary"
        class="mb-2"
        @click="getCategoriesForce"
        :loading="loader"
        :disabled="loader"
      >
        <v-icon>list</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn small color="primary" class="mb-2" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <FormCategori @cancel="handleAction"></FormCategori>
      </v-dialog>
      <v-dialog
        v-model="dialogDelete"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <DeleteCategori @cancel="dialogDelete=false"></DeleteCategori>
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
    <ListCategories @actionList="handleAction" :search="search"></ListCategories>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { App } from "@/Helpers/Globales";
import FormCategori from "./categories/FormCategori.vue";
import ListCategories from "./categories/ListCategories.vue";
import DeleteCategori from "./categories/DeleteCategori.vue";
export default {
  name: "Categories",
  components: { FormCategori, ListCategories, DeleteCategori },
  computed: {
    ...mapState(["shopActive"]),
    ...mapState("categories", ["categories", "loader"])
  },
  mounted() {
    this.getCategories();
  },
  watch: {
    dialog(d) {
      if (!d) {
        this.setCategori();
      }
    },
    dialogDelete(d) {
      if (!d) {
        this.setCategori();
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
    ...mapActions("categories", {
      getCategories: "getAll",
      getCategoriesForce: "getForce"
    }),
    ...mapMutations("categories", {
      setCategori: "SET"
    }),
    activeForm() {
      this.dialog = true;
    },
    handleAction(action) {
      if (!action) {
        this.dialog = false;
        return;
      }
      this.setCategori(action.item);
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
#Categories {
  v-toolbar-title {
    width: 100%;
  }
  width: 100%;
}
</style>
