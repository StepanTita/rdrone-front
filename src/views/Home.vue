<template>
  <div class="home">
    <travel-map/>
  </div>
</template>

<script>
// @ is an alias to /src
import TravelMap from "@/components/TravelMap";

export default {
  name: 'Home',
  components: {
    TravelMap
  }
}
</script>

<style>
.home {
  height: 100%;
}
</style>