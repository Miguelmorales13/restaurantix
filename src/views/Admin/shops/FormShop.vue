<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$emit('cancel')">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{shop._id?'Actualizar':'Agregar'}}</v-toolbar-title>
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
                v-model="shop.name"
                :rules="validations.name"
                label="Nombre"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="shop.address" :rules="validations.address" label="Dirección"></v-textarea>
            </v-flex>
            <v-flex v-if="shop._id" xs12>
              <v-select :items="status" v-model="shop.status" required label="Estatus"></v-select>
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
import { mapState, mapMutations } from "vuex";
import { getAnyUser, isSuperSu } from "@/Helpers/TokenValid";
export default {
  name: "FormShop",
  computed: {
    ...mapState("shops", ["selectedShop"]),
    ...mapState(["shopActive"])
  },
  mounted() {
    this.shop = Object.assign({}, this.selectedShop);
  },
  watch: {
    selectedShop(newStatus, oldStatus) {
      this.shop = Object.assign({}, newStatus);
    }
  },
  data: () => ({
    petition: false,
    app: App,
    isSuperSu: isSuperSu(),
    valid: false,
    shop: {},
    status: ["Activo", "Inactivo"],
    validations: {
      name: [
        v => !!v || "requerido",
        v => (v && v.length >= 3) || "Minimo 3 caracteres"
      ],
      address: [
        v => !!v || "requerido",
        v => (v && v.length > 5) || "minimo 5 digitos"
      ],
      status: [v => !!v || "requerido"]
    }
  }),
  methods: {
    ...mapMutations("shops", {
      add: "ADD",
      update: "UPDATE"
    }),
    async onSubmit() {
      this.petition = true;
      try {
        if (this.valid) await this.$refs.form.validate();
        if (!this.valid) return toastr.info("verifica tus datos");
        if (this.shop._id) {
          const res = await Aput("shops", this.shop._id, this.shop);
          this.update(res.data);
          this.cancel();
        } else {
          const res = await Apost("shops", this.shop);
          this.add(res.data);
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
