
<template>
  <div id="Categori">
    <b>Nombre:&nbsp;</b>
    {{selectedCategori.name}}
    <br>
    <b>Fecha de creación:&nbsp;</b>
    {{moment(selectedCategori.createdAt).fromNow()}}
    <br>
    <b>Ultima actualizacion:&nbsp;</b>
    {{moment(selectedCategori.updatedAt).fromNow()}}
    <br>
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Categori",
  computed: {
    ...mapState("categories", ["selectedCategori"])
  }
};
</script>