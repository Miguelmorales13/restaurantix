<template>
  <v-data-table
    :headers="headers"
    :expand="true"
    item-key="name"
    :loading="loader"
    :search="search"
    :items="menus | shop(this.shopActive)"
    class="elevation-8"
  >
    <template v-slot:items="props">
      <td @click="props.expanded = !props.expanded">{{ props.item.name }}</td>
      <td class="justify-center layout px-0">
        <v-icon small class="mr-2" @click="onUpdate(props.item)">edit</v-icon>
        <!-- <v-icon small @click="onDelete(props.item)">delete</v-icon> -->
      </td>
    </template>
    <template v-slot:expand="props">
      <v-card flat>
        <v-card-text>
          <span>
            <b>Estatus:</b>
            {{props.item.status}}
          </span>
          <br>
          <span>
            <b>Precio:</b>
            {{props.item.price}}
          </span>
          <br>
          <span>
            <b>Descripcion:</b>
            {{props.item.description}}
          </span>
          <br>
        </v-card-text>
      </v-card>
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
import { mapState, mapGetters } from "vuex";
import { isSuperSu } from "@/Helpers/TokenValid";
export default {
  name: "ListMenus",
  props: {
    search: String
  },
  computed: {
    ...mapState("menus", ["menus","loader"]),
    ...mapState(["shopActive"])
  },
  data: () => ({
    headers: [
      { text: "Nombre", value: "name", text: "center" },
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
