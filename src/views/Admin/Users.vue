<template>
  <div id="Users">
    <v-toolbar flat class="elevation-5">
      <v-toolbar-title>Usuarios</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small color="secondary" class="mb-2" :loading="loader" :disabled="loader" @click="getUsersForce" >
        <v-icon>list</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn small color="primary" class="mb-2" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <FormUser @cancel="handleAction"></FormUser>
      </v-dialog>
      <v-dialog
        v-model="dialogDelete"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <DeleteUser @cancel="dialogDelete = false"></DeleteUser>
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
    <ListUsers @actionList="handleAction" :search="search"></ListUsers>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { App } from "@/Helpers/Globales";
import FormUser from "./users/FormUser.vue";
import ListUsers from "./users/ListUsers.vue";
import DeleteUser from "./users/DeleteUser.vue";
export default {
  name: "Users",
  components: { FormUser, ListUsers, DeleteUser },
  computed: {
    ...mapState(["shopActive"]),
    ...mapState('users',['loader','users'])
  },
  mounted() {
    this.getUsers();
  },
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    app: App
  }),
  watch:{
    dialog(d){
      if (!d) {
        this.setUser()
      }
    },
    dialogDelete(d){
      if (!d) {
        this.setUser()
      }
    }
  },
  methods: {
    ...mapActions("users", {
      getUsers: "getAll",
      getUsersForce: "getForce",
    }),
    ...mapMutations("users", {
      setUser: "SET"
    }),
    activeForm() {
      this.dialog = true;
    },
    handleAction(action) {
      if (!action) return this.dialog = false;
      this.setUser(action.item);
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
#Users {
  v-toolbar-title {
    width: 100%;
  }
  width: 100%;
}
</style>
