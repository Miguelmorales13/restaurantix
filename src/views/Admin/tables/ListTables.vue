<template>
  <v-data-table
    :headers="headers"
    item-key="number"
    :search="search"
    :loading="loader"
    :items="tables | shop(this.shopActive)"
    class="elevation-8"
  >
    <template v-slot:items="props">
      <td>
        <v-badge :color="props.item.status === 'Ocupada'?'red':'success'">
          <template v-if="props.item.status === 'Ocupada'" v-slot:badge>
            <span>O</span>
          </template>
          <template v-else v-slot:badge>
            <span>D</span>
          </template>
          no. {{ props.item.number }}
        </v-badge>
      </td>
      <td class="justify-center layout px-0">
        <v-icon small class="mr-2" @click="onUpdate(props.item)">edit</v-icon>
        <!-- <v-icon small @click="onDelete(props.item)">delete</v-icon> -->
      </td>
    </template>
    <v-alert
      v-slot:no-results
      :value="true"
      color="error"
      icon="warning"
    >Your search for "{{ search }}" found no results.</v-alert>
  </v-data-table>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "ListTables",
  props: {
    search: String
  },
  computed: {
    ...mapState("tables", ["tables","loader"]),
    ...mapState(["shopActive"])
  },
  data: () => ({
    headers: [
      { text: "Numero", value: "number" },
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
