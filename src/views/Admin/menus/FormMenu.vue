<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{menu._id?'Actualizar':'Agregar'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat :disabled="petition" :loading="petition" @click="onSubmit">Guardar</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmit" lazy-validation>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm8>
              <v-text-field
                :autofocus="true"
                v-model="menu.name"
                :rules="validations.name"
                label="Nombre"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field
                v-model="menu.price"
                :rules="validations.price"
                label="Precio"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="menu.description"
                :rules="validations.description"
                label="Descripcion"
              ></v-textarea>
            </v-flex>
            <v-flex xs12>
              <v-select
                :items="categories"
                item-text="name"
                item-value="_id"
                :rules="validations.categori"
                v-model="menu._categori"
                required
                label="Categoria"
              ></v-select>
            </v-flex>
            <v-flex v-if="menu._id" xs12>
              <v-select :items="status" v-model="menu.status" required label="Estatus"></v-select>
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
import { mapState, mapActions } from "vuex";
import { getAnyUser, isSuperSu } from "@/Helpers/TokenValid";
export default {
  name: "FormMenu",
  computed: {
    ...mapState("menus", ["selectedMenu"]),
    ...mapState("categories", ["categories", "loader"]),
    ...mapState(["shopActive"])
  },
  mounted() {
    this.menu = Object.assign({}, this.selectedMenu);
  },
  watch: {
    selectedMenu(newStatus) {
      this.menu = Object.assign(
        {},
        {
          ...newStatus,
          _categori: newStatus._categori ? newStatus._categori._id : ""
        }
      );
    }
  },
  data: () => ({
    petition: false,
    app: App,
    isSuperSu: isSuperSu(),
    valid: false,
    menu: {},
    status: ["Activo", "Inactivo"],
    validations: {
      name: [v => !!v || "requerido"],
      price: [v => !!v || "requerido"],
      categori: [v => !!v || "requerido"],
      description: [v => !!v || "requerido"]
    }
  }),
  methods: {
    async onSubmit() {
      this.petition = true;
      try {
        if (this.valid) await this.$refs.form.validate();
        if (!this.valid) return toastr.info("verifica tus datos");
        const { _id, name, status, price, description } = this.menu;
        if (this.menu._id) {
          const res = await Aput("menus", this.menu._id, {
            ...this.menu,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
          this.cancel();
        } else {
          const res = await Apost("menus", {
            ...this.menu,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
          this.cancel();
        }
      } catch (error) {
        managementErrors(error);
      } finally {
        this.petition = false;
      }
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
