<template>
  <div class="home">

  </div>
</template>

<script>
// @ is an alias to /src

import {OccasionsQuerier} from "@/services/occasions/occasions";

export default {
  name: 'Occasion',
  data() {
    return {
      comments: []
    }
  },
  async mounted() {
    this.occasionsQuerier = new OccasionsQuerier();
  },
}
</script>
