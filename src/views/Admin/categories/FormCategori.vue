<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{categori._id?'Actualizar':'Agregar'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat :disabled="petition" :loading="petition" @click="onSubmit">Guardar</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmit" lazy-validation>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                :autofocus="true"
                v-model="categori.name"
                :rules="validations.name"
                label="Nombre"
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
import { mapState, mapActions } from "vuex";
import { getAnyUser, isSuperSu } from "@/Helpers/TokenValid";
export default {
  name: "FormCategori",
  computed: {
    ...mapState("categories", ["selectedCategori"]),
    ...mapState(["shopActive"])
  },
  mounted() {
    this.categori = Object.assign({}, this.selectedCategori);
  },
  watch: {
    selectedCategori(newStatus) {
      this.categori = Object.assign({}, newStatus);
    }
  },
  data: () => ({
    petition: false,
    app: App,
    isSuperSu: isSuperSu(),
    valid: false,
    categori: {},
    status: ["Activo", "Inactivo"],
    validations: {
      name: [v => !!v || "requerido"]
    }
  }),
  methods: {
    async onSubmit() {
      this.petition = true;
      try {
        if (this.valid) await this.$refs.form.validate();
        if (!this.valid) return toastr.info("verifica tus datos");
        const { _id, name, status, price, description } = this.categori;
        if (this.categori._id) {
          const res = await Aput("categories", this.categori._id, {
            ...this.categori,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
          this.cancel();
        } else {
          const res = await Apost("categories", {
            ...this.categori,
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
