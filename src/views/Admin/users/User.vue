<template>
  <div id="User">
    <b>Nombre:&nbsp;</b>
    {{selectedUser.name}}
    <br>
    <b>Estatus:&nbsp;</b>
    {{selectedUser.status}}
    <br>
    <b>Telefono:&nbsp;</b>
    {{selectedUser.phone}}
    <br>
    <b>Tienda:&nbsp;</b>
    {{selectedUser._shop?selectedUser._shop.name:''}}
    <br>
    <b>Rol:&nbsp;</b>
    {{selectedUser.rol}}
    <br>
    <b>Fecha de creación:&nbsp;</b>
    {{moment(selectedUser.createdAt).fromNow()}}
    <br>
    <b>Ultima actualizacion:&nbsp;</b>
    {{moment(selectedUser.updatedAt).fromNow()}}
    <br>
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "User",
  computed: {
    ...mapState("users", ["selectedUser"])
  }
};
</script>