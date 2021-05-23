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
        <img class="card-img-top" v-bind:src="infoWindow.Data().image" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">{{ infoWindow.Data().title }}</h5>
          <p class="card-text">{{ infoWindow.Data().description }}</p>
          <p class="card-text"><small class="text-muted">Last updated
            {{ new Date(infoWindow.Data().updatedAt).toLocaleString() }}</small></p>
          <router-link to="/about" class="btn btn-light">Details</router-link>
          <router-link v-bind:to="`/comments/${infoWindow.Data().id}`" class="btn btn-light">Comments</router-link>
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