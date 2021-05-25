<template>
  <div>
    <gmap-info-window
        v-if="infoWindow"
        :opened="options.open"
        :options="options.infoOptions"
        :position="infoWindow.Position()"
        @closeclick="options.open=false"
    >
      <div class="card" v-if="infoWindow.Data()">
        <img class="card-img-top" v-if="infoWindow.Data().Image()" v-bind:src="infoWindow.Data().Image()" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">{{ infoWindow.Data().Title() }}</h5>
          <p class="card-text">{{ infoWindow.Data().Desc() }}</p>
          <p class="card-text"><small class="text-muted">
            {{ infoWindow.Data().Date() }}</small></p>
          <div v-if="infoWindow.Data().Related()">
            <router-link v-bind:to="`/occasion/details/${infoWindow.Id()}`" class="btn btn-light">Details</router-link>
            <router-link v-bind:to="`/comments/${infoWindow.Id()}`" class="btn btn-light">Comments</router-link>
          </div>
        </div>
      </div>
    </gmap-info-window>
  </div>
</template>

<script>
export default {
  name: 'InfoWindow',
  props: {
    infoWindow: Object,
    options: Object,
  }
};
</script>

<style scoped>
.btn {
  margin-right: 10px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.card {
  border: none !important;
}
</style>