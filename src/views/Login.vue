<template>
  <div id="login">
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12 sm8 md3>
        <h5 class="text-xs-center">{{ app }}</h5>
        <v-form ref="form" @submit="onSubmit" v-model="valid" lazy-validation>
          <v-text-field v-model="login.user" :rules="validUser" label="Usuario" required></v-text-field>
          <v-text-field
            v-model="login.password"
            :rules="validPassword"
            label="Contraseña"
            type="password"
            required
          ></v-text-field>
          <v-btn :disabled="!valid" block color="success" type="submit">Iniciar sesion</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import { Apost } from "@/Helpers/Api";
import { App, managementErrors } from "@/Helpers/Globales";
import { login, getAnyUser } from "@/Helpers/TokenValid";
import toastr from "toastr";
export default {
  name: "login",
  data: () => ({
    app: App,
    valid: true,
    login: {
      user: "",
      password: ""
    },
    validUser: [v => !!v || "Usuario requerido"],
    validPassword: [v => !!v || "Contraseña requerida"]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    async onSubmit(e) {
      e.preventDefault();
      try {
        if (!this.valid) return toastr.info("verifica tus datos");
        const res = await Apost("auth", this.login);
        login(
          res.data.token,
          () => {
            toastr.success("Iniciando sesion");
            if (getAnyUser("rol")=="Super administrador" || getAnyUser("rol")=="Administrador") {
              this.$router.push({ name: "inicioAdmin" });
            } else if(getAnyUser("rol")=="Mesero") {
              this.$router.push({ name: "mesero" });
            } else{
              this.$router.push({ name: "cocinero" });
            }
          },
          () => toastr.info("credeciales invalidas")
        );
      } catch (error) {
        managementErrors(error);
      }
    }
  }
};
</script>
<style lang="scss">
#login {
  .row {
    min-height: 100vh;
    width: 100%;
    padding: 1em;
  }
}
</style>
