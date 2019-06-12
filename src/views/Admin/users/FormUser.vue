<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{user._id?'Actualizar':'Agregar'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat :disabled="petition" :loading="petition" @click="onSubmit">Guardar</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmit" lazy-validation>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field v-model="user.name" :rules="validations.name" label="Ingrese el nombre"></v-text-field>
            </v-flex>
            <v-flex v-if="!user._id" xs12 sm6>
              <v-text-field
              :autofocus="true"
                v-model="user.user"
                :rules="validations.user"
                label="Ingrese el usuario"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                v-model="user.phone"
                :rules="validations.phone"
                type="tel"
                label="Ingrese el telefono"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select :items="rols" v-model="user.rol" required label="Rol"></v-select>
            </v-flex>
            <v-flex v-if="user._id" xs12 sm6>
              <v-select :items="status" v-model="user.status" required label="Estatus"></v-select>
            </v-flex>
            <v-flex v-if="!user._id" xs12 sm6>
              <v-text-field
                v-model="user.password"
                :rules="validations.password"
                type="password"
                label="Ingrese el contraseña"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import { Apost, Aput } from "@/Helpers/Api";
import toastr from "toastr";
import { managementErrors, App } from "@/Helpers/Globales";
import { mapState, mapMutations, mapActions } from "vuex";
import { getAnyUser, isSuperSu } from "@/Helpers/TokenValid";
export default {
  name: "FormUser",
  computed: {
    ...mapState("users", ["selectedUser"]),
    ...mapState(["shopActive"])
  },
  mounted() {
    this.user = Object.assign({}, this.selectedUser);
    this.validations = this.generateValidations(this.user._id);
  },
  watch: {
    selectedUser(newStatus, oldStatus) {
      this.user = Object.assign(
        {},
        {
          ...newStatus,
          _shop: newStatus._shop ? newStatus._shop._id : ""
        }
      );
      this.validations = this.generateValidations(newStatus._id);
    },
    ["user.name"](name) {
      if (name) {
        this.user.user = String(name).replace(/ /g, "_");
      }
    }
  },
  data: () => ({
    petition:false,
    app: App,
    isSuperSu: isSuperSu(),
    valid: false,
    user: {},
    rols: isSuperSu()?["Super administrador", "Administrador", "Mesero", "Cocinero"]:["Administrador", "Mesero", "Cocinero"],
    status: ["Activo", "Inactivo"],
    validations: {}
  }),
  methods: {
    ...mapMutations("users", {
      add: "ADD",
      update: "UPDATE"
    }),
    async onSubmit() {
      this.petition=false
      try {
        if (this.valid) await this.$refs.form.validate()
        if (!this.valid) return toastr.info("verifica tus datos");
        if (this.user._id) {
          const { _id, rol, status, name, phone } = this.user;
          const newUser =
            rol !== "Super administrador"
              ? {
                  _id,
                  rol,
                  _shop: isSuperSu()
                    ? this.shopActive
                    : getAnyUser("_shop._id"),
                  status,
                  name,
                  phone
                }
              : { _id, rol, status, name, phone };
          const res = await Aput("users", this.user._id, { ...newUser });
          this.update(res.data);
          this.cancel();
        } else {
          const { _id, rol, status, name, user, password, phone } = this.user;
          const newUser =
            rol !== "Super administrador"
              ? {
                  _id,
                  user,
                  password,
                  rol,
                  _shop: isSuperSu()
                    ? this.shopActive
                    : getAnyUser("_shop._id"),
                  status,
                  name,
                  phone
                }
              : { _id, rol, _shop: null, status, user, password, name, phone };
          const res = await Apost("users", { ...newUser });
          this.add(res.data);
          this.cancel();
        }
      } catch (error) {
        managementErrors(error);
      } finally {
        this.petition=false
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    generateValidations(id) {
      let validations = {
        name: [
          v => !!v || "requerido",
          v => (v && v.length >= 3) || "Minimo 3 caracteres"
        ],
        phone: [
          v => !!v || "requerido",
          v => (v && v.length === 10) || "10 digitos"
        ],
        status: [v => !!v || "requerido"],
        rol: [v => !!v || "requerido"]
      };
      if (!id) {
        validations = {
          ...validations,
          password: [
            v => !!v || "Contraseña requerida",
            v => (v && v.length >= 5) || "Minimo 5 caracteres"
          ],
          user: [
            v => !!v || "Usuario requerido",
            v => (v && v.length >= 3) || "Minimo 3 caracteres"
          ]
        };
      }
      return validations;
    }
  }
};
</script>
