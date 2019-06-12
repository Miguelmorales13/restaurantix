<template>
  <div id="Menus">
    <v-toolbar flat class="elevation-5">
      <v-toolbar-title>Menu</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        small
        color="secondary"
        class="mb-2"
        @click="getMenusForce"
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
        <FormMenu @cancel="handleAction"></FormMenu>
      </v-dialog>
      <v-dialog
        v-model="dialogDelete"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <DeleteMenu @cancel="dialogDelete=false"></DeleteMenu>
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
    <ListMenus @actionList="handleAction" :search="search"></ListMenus>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { App } from "@/Helpers/Globales";
import FormMenu from "./menus/FormMenu.vue";
import ListMenus from "./menus/ListMenus.vue";
import DeleteMenu from "./menus/DeleteMenu.vue";
export default {
  name: "Menus",
  components: { FormMenu, ListMenus, DeleteMenu },
  computed: {
    ...mapState(["shopActive"]),
    ...mapState("menus", ["menus", "loader"])
  },
  mounted() {
    this.getMenus();
    this.getCategories();
  },
  watch: {
    dialog(d) {
      if (!d) {
        this.setMenu();
      }
    },
    dialogDelete(d) {
      if (!d) {
        this.setMenu();
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
    ...mapActions("menus", {
      getMenus: "getAll",
      getMenusForce: "getForce"
    }),
    ...mapActions("categories", {
      getCategories: "getAll"
    }),
    ...mapMutations("menus", {
      setMenu: "SET"
    }),
    activeForm() {
      this.dialog = true;
    },
    handleAction(action) {
      if (!action) {
        this.dialog = false;
        return;
      }
      this.setMenu(action.item);
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
#Menus {
  v-toolbar-title {
    width: 100%;
  }
  width: 100%;
}
</style>
