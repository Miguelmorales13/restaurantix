<template>
  <v-data-table
    :headers="headers"
    item-key="_id"
    :expand="true"
    :loading="loader"
    :search="search"
    :items="orders | shop(this.shopActive) | sort('desc')"
    class="elevation-8"
  >
    <template v-slot:items="props">
      <td @click="props.expanded = !props.expanded">
        <v-badge :color="props.item.status === 'En proceso'?'red':'success'">
          <template v-slot:badge>
            <span v-if="props.item.status === 'En proceso'">P</span>
            <span v-else>T</span>
          </template>
          {{props.item.createdAt |fromNow}} -> Mesa. {{ props.item._table.number }}
        </v-badge>
      </td>
      <td class="justify-center layout px-0">
        <v-icon small class="mr-2" @click="onUpdate(props.item)">edit</v-icon>
        <!-- <v-icon small @click="onDelete(props.item)">delete</v-icon> -->
      </td>
    </template>
    <template v-slot:expand="props">
      <v-card flat>
        <v-card-text>
          <span>
            <b>Total:</b>
            {{props.item.total}}
          </span>
          <br>
          <span>
            <b>Estatus:</b>
            {{props.item.status}}
          </span>
          <br>
        </v-card-text>
      </v-card>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "ListOrders",
  props: {
    search: String
  },
  computed: {
    ...mapState("orders", ["orders","loader"]),
    ...mapState(["shopActive"])
  },
  data: () => ({
    headers: [
      { text: "Orden", value: "createdAt", sortable: false },
      { text: "Actions", value: "_id", sortable: false }
    ]
  }),
  methods: {
    onDelete(item) {
      this.$emit("actionList", { type: "delete", item });
    },
    onUpdate(item) {
      this.$emit("actionList", { type: "update", item });
    }
  }
};
</script>
<style lang="scss">
.elevation-1 {
  width: 100%;
}
</style>
