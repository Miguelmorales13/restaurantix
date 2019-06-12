<template>
  <v-data-table
    :headers="headers"
    :expand="true"
    item-key="name"
    :search="search"
    :loading="loader"
    :items="shops"
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
            <b>Dirección:</b>
            {{props.item.address}}
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
  name: "ListShops",
  props: {
    search: String
  },
  computed: {
    ...mapState("shops", ["shops","loader"])
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
