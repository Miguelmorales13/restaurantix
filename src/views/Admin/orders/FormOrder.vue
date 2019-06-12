<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{order._id?'Actualizar':'Agregar'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat :disabled="petition" :loading="petition" @click="onSubmit">Guardar</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmit" lazy-validation>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs9>
              <v-select
                v-model="selectPlate"
                :hint="`$ ${selectPlate.price}`"
                persistent-hint
                return-object
                label="Seleccione un platillo"
                :items="menus | shop(this.shopActive)"
                item-text="name"
                item-value="_id"
              ></v-select>
            </v-flex>
            <v-flex xs3>
              <v-btn color="success" small @click="addToMenu">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="order._table"
                label="Seleccione una mesa"
                :items="tables| shop(this.shopActive) | tablesActives"
                :rules="validations._table"
                item-text="number"
                item-value="_id"
              ></v-select>
            </v-flex>
            <v-flex xs6 class="text-xs-center">Total : {{order.total}}</v-flex>
            <v-flex v-if="order._id" xs12>
              <v-select :items="status" v-model="order.status" required label="Estatus"></v-select>
            </v-flex>
            <v-flex xs12>
              <v-card v-for="(menu,i) in menuSorted " :key="i">
                <v-card-text>
                  <v-layout row wrap>
                    <span>{{menu.plate | nameMenu(menus)}}</span>
                    <v-spacer></v-spacer>
                    <v-icon @click="deleteFromMenu(menu.plate)">close</v-icon>
                  </v-layout>
                  <v-layout row wrap>
                    <span class="text-xs-center">{{menu.cantidad }}</span>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cangeCantidad(menu,'remove')">
                      <v-icon>exposure_neg_1</v-icon>
                    </v-btn>
                    <v-btn small color="success" @click="cangeCantidad(menu,'add')">
                      <v-icon>exposure_plus_1</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-textarea
                        class="pt-0"
                        v-model="menu.observations"
                        label="Tiene alguna observacion"
                        rows="1"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
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
  name: "FormOrder",
  computed: {
    ...mapState(["shopActive"]),
    ...mapState("orders", ["selectedOrder"]),
    ...mapState("menus", ["menus"]),
    ...mapState("tables", ["tables"]),
    menuSorted() {
      if (!this.order.menu || this.order.menu.length === 0) return [];
      return [...this.order.menu].sort((a, b) => {
          if (a.plate > b.plate) {
            return 1;
          }
          if (a.plate < b.plate) {
            return -1;
          }
          return 0;
        });
    }
  },
  mounted() {
    this.order = Object.assign({}, this.selectedOrder);
  },
  watch: {
    selectedOrder(newStatus) {
      this.order = Object.assign(
        {},
        {
          ...newStatus,
          _table: newStatus._table ? newStatus._table._id : ""
        }
      );
    },
    ["order.menu"](menu) {
      if (!menu || menu.length === 0) return (this.order.total = 0);
      this.order.total = menu
        .map(m => {
          const plate = this.menus.find(mm => mm._id == m.plate);
          return m.cantidad * plate.price;
        })
        .reduce((b, a) => b + a);
    }
  },
  data: () => ({
    petition:false,
    app: App,
    isSuperSu: isSuperSu(),
    selectPlate: { _id: "", price: 0 },
    valid: false,
    order: { menu: [] },
    status: ["En proceso", "Terminada"],
    validations: {
      _table: [v => !!v || "requerido"],
      plate: [v => !!v || "requerido"]
    }
  }),
  methods: {
    ...mapActions("tables", ["setStatusTable"]),
    async onSubmit() {
      this.petition=true
      try {
        if (this.valid) await this.$refs.form.validate()
        if (!this.valid) return toastr.info("verifica tus datos");
        if (this.order.menu.length === 0)
          return toastr.info("agrega platillos a tu lista");
        if (this.order._id) {
          const res = await Aput("orders", this.order._id, {
            ...this.order,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
          this.cancel();
        } else {
          const res = await Apost("orders", {
            ...this.order,
            _shop: isSuperSu() ? this.shopActive : getAnyUser("_shop._id")
          });
          this.cancel();
        }
      } catch (error) {
        managementErrors(error);
      }  finally {
        this.petition=false
      }
    },
    addToMenu() {
      if (!this.selectPlate._id) return toastr.error("selecciona un platillo");
      const plate = this.order.menu.find(p => p.plate === this.selectPlate._id);
      if (plate) {
        const menus = this.order.menu.filter(
          p => p.plate !== this.selectPlate._id
        );
        this.order.menu = [
          ...menus,
          { ...plate, cantidad: parseInt(plate.cantidad) + 1 }
        ];
      } else {
        this.order.menu = [
          ...this.order.menu,
          { plate: this.selectPlate._id, observation: "", cantidad: 1 }
        ];
      }
    },
    deleteFromMenu(plate) {
      this.order.menu = this.order.menu.filter(p => p.plate !== plate);
    },
    cangeCantidad(item, type) {
      const newPlate = this.order.menu.filter(p => p.plate !== item.plate);
      if (type === "add") {
        this.order.menu = [
          ...newPlate,
          { ...item, cantidad: parseInt(item.cantidad) + 1 }
        ];
      } else {
        if (item.cantidad <= 0) return;
        this.order.menu = [
          ...newPlate,
          { ...item, cantidad: parseInt(item.cantidad) - 1 }
        ];
      }
    },
    cancel() {
      this.$emit("cancel");
    }
  },

  filters: {
    nameMenu(value, ...args) {
      if (!value) return "";
      return args[0].find(m => m._id === value).name;
    },

    tablesActives(value) {
      if (!value) return "";
      return value.filter(t => t.status === "Desocupada");
    }
  }
};
</script>
<style lang="scss">
.v-card__text {
  padding: 0.5em;
}
.text-xs-center {
  min-width: 60px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
</style>
