<template>
  <div id="Menu">
    <b>Nombre:&nbsp;</b>
    {{selectedMenu.name}}
    <br>
    <b>Estatus:&nbsp;</b>
    {{selectedMenu.status}}
    <br>
    <b>Descripcion:&nbsp;</b>
    {{selectedMenu.description}}
    <br>
    <b>Tienda:&nbsp;</b>
    {{selectedMenu._shop?selectedMenu._shop.name:''}}
    <br>
    <b>Peecio:&nbsp;</b>
    {{selectedMenu.price}}
    <br>
    <b>Fecha de creación:&nbsp;</b>
    {{moment(selectedMenu.createdAt).fromNow()}}
    <br>
    <b>Ultima actualizacion:&nbsp;</b>
    {{moment(selectedMenu.updatedAt).fromNow()}}
    <br>
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Menu",
  computed: {
    ...mapState("menus", ["selectedMenu"])
  }
};
</script>