<template>
  <div id="Table">
    <b>Numero:&nbsp;</b>
    {{selectedTable.number?selectedTable.number:''}}
    <br>
    <b>Estatus:&nbsp;</b>
    {{selectedTable.status}}
    <br>
    <b>Tienda:&nbsp;</b>
    {{selectedTable._shop?selectedTable._shop.name:''}}
    <br>
    <b>Fecha de creación:&nbsp;</b>
    {{moment(selectedTable.createdAt).fromNow()}}
    <br>
    <b>Ultima actualizacion:&nbsp;</b>
    {{moment(selectedTable.updatedAt).fromNow()}}
    <br>
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Table",
  computed: {
    ...mapState("tables", ["selectedTable"])
  }
};
</script>