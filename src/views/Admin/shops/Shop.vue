<template>
  <div id="Shop">
    <b>Nombre:&nbsp;</b>
    {{selectedShop.name}}
    <br>
    <b>Dirección:&nbsp;</b>
    {{selectedShop.address}}
    <br>
    <b>Estatus:&nbsp;</b>
    {{selectedShop.status}}
    <br>
    <b>Fecha de creación:&nbsp;</b>
    {{moment(selectedShop.createdAt).fromNow()}}
    <br>
    <b>Ultima actualizacion:&nbsp;</b>
    {{moment(selectedShop.updatedAt).fromNow()}}
    <br>
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Shop",
  computed: {
    ...mapState("shops", ["selectedShop"])
  }
};
</script>