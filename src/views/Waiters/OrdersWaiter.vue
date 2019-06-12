<template>
  <div id="OrdersWaiter">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs4 sm3 mb-2 v-for="elem in orderByName" :key="elem._id">
          <v-card
            :class="`elevation-${elem.status==='Ocupada'?'0':'8'}`"
            style="cursor:pointer;"
            dark
            :color="elem.status==='Ocupada'?'red':'primary'"
            @click="gochangeOrder(elem._id)"
          >
            <v-card-text class="py-4">{{elem.number}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "OrdersWaiter",
  computed: {
    ...mapGetters("tables", ["orderByName"]),
    ...mapState("orders", ["orders"])
  },
  data: () => ({}),
  methods: {
    gochangeOrder(_table) {
      const order = this.orders.find(o => o._table._id === _table);
      if (!order) {
        this.$emit("goOrder", { menu: [], _table: { _id: _table } });
      } else {
        this.$emit("goOrder", { ...order, _table: { _id: _table } });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.v-card {
  min-height: 4em;
}
</style>
