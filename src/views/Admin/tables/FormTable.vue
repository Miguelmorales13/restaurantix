<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{table._id?'Actualizar':'Agregar'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat :disabled="petition || !valid" :loading="petition" @click="onSubmit">Guardar</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="onSubmit" ref="form" lazy-validation>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                :autofocus="true"
                v-model="table.number"
                :rules="validations.number"
                label="Ingrese el Numero"
              ></v-text-field>
            </v-flex>
            <v-flex v-if="table._id" xs12>
              <v-select :items="status" v-model="table.status" required label="Estatus"></v-select>
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
import { mapState } from "vuex";
import { getAnyUser, isSuperSu } from "@/Helpers/TokenValid";
export default {
  name: "FormTable",
  computed: {
    ...mapState("tables", ["selectedTable"]),
    ...mapState(["shopActive"])
  },
  mounted() {
    this.table = Object.assign({}, this.selectedTable);
  },
  watch: {
    selectedTable(newStatus) {
      this.table = Object.assign({}, newStatus);
    }
  },
  data: () => ({
    petition:false,
    app: App,
    isSuperSu: isSuperSu(),
    valid: false,
    table: {},
    status: ["Ocupada", "Desocupada"],
    validations: {
      number: [v => !!v || "requerido"]
    }
  }),
  methods: {
    async onSubmit() {
      this.petition=true
      try {
        if (this.valid) await this.$refs.form.validate()
        if (!this.valid) return toastr.info("verifica tus datos");
        if (this.table._id) {
          const res = await Aput("tables", this.table._id, {
            ...this.table,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
          this.cancel();
        } else {
          const res = await Apost("tables", {
            ...this.table,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
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
    }
  }
};
</script>
