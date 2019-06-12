
<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="elevation-5">
          <v-card-title>Ganancias</v-card-title>
          <v-card-text>
            <table style="width:100%">
              <tbody>
                <tr>
                  <td>Hoy</td>
                  <td>$ {{getTotalDay}}</td>
                </tr>
                <tr>
                  <td>Esta semana</td>
                  <td>$ {{getTotalWeekThis}}</td>
                </tr>
                <tr>
                  <td>Semana pasada</td>
                  <td>$ {{getTotalWeek}}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card class="elevation-5">
          <v-card-title>Platillos vendidos de la semana pasada</v-card-title>
          <v-card-text v-if="getPlatesWeek.labels.length>0">
            <Chart :chartdata="getPlatesWeek" :options="options"></Chart>
          </v-card-text>
          <v-card-text v-else>Aun no hay registros de esta semana</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card class="elevation-5">
          <v-card-title>Platillos vendidos</v-card-title>
          <v-card-text v-if="getPlatesWeekThis.labels.length>0">
            <Chart :chartdata="getPlatesWeekThis" :options="options"></Chart>
          </v-card-text>
          <v-card-text v-else>Aun no hay registros de esta semana</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import Chart from "@/components/Chart";
export default {
  name: "HomeAdmin",
  components: { Chart },
  computed: {
    ...mapGetters("orders", [
      "getTotalDay",
      "getPlatesWeek",
      "getTotalWeek",
      "getTotalWeekThis",
      "getPlatesWeekThis"
    ])
  },
  data: () => ({
    options: null
  }),
  mounted() {
    this.getAll();
    this.getmenus();
    this.options = {
      responsive: true,
      legend: {
        display: false
      }
    };
  },
  methods: {
    ...mapActions("orders", ["getAll"]),
    ...mapActions("menus", {
      getmenus: "getAll"
    }),
    dynamicColors() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
<!-- Aplicación dónde
 se pueda pedir los
 productos de un menú se
  pueda pagar con tarjeta directo o
  una opción en efectivo tener opciones
  para mandar tu ubicación o poner
  directo dirección destino también
  después de completar la orden el
  cliente que pueda ver la transición
  del pedido por el lado del restaurante
  que puedan ver el pedido en una web de
  administración dónde pueda ver la cocina
  el pedido y otra dónde dónde imprimir un
  ticket con la información del pedido dirección cliente etc. -->
<!-- Quiero crear una aplicacion que pueda unir personas con profesores particulares. -->
<!-- Es un “uber” de profesores. -->
<!-- Cuanto me cobrarian? -->
