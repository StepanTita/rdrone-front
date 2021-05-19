<template>
  <div class="map-container">
    <l-map
        style="height: 100%; width: 100%"
        ref="roadMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        @ready="setCenter"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
        @click="addMarker"
        id="roadMap">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker v-for="occasion in occasions" :lat-lng="[occasion.lat, occasion.lng]">
        <l-popup>
          <div class="card">
            <img class="card-img-top" v-bind:src="occasion.image" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">{{ occasion.title }}</h5>
              <p class="card-text">{{ occasion.description }}</p>
              <p class="card-text"><small class="text-muted">Last updated
                {{ new Date(occasion.updatedAt).toLocaleString() }}</small></p>
              <router-link to="/about" class="btn btn-light">Details</router-link>
              <router-link v-bind:to="`/comments/${occasion.id}`" class="btn btn-light">Comments</router-link>
            </div>
          </div>
        </l-popup>
        <!--        <l-icon-->
        <!--            icon-url="https://assets.mapquestapi.com/icon/v2/incident@2x.png"-->
        <!--            v-bind:icon-size=[56,64]-->
        <!--        />-->
      </l-marker>
      <l-marker v-if="newOccasion" :lat-lng="[newOccasion.lat, newOccasion.lng]">
        <l-icon
            icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
        />
      </l-marker>
<!--      <l-marker v-for="waypoint in waypoints" :lat-lng="[waypoint.lat, waypoint.lng]">-->
<!--        <l-icon-->
<!--            icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"-->
<!--        />-->
<!--      </l-marker>-->
      <l-routing-machine v-bind:waypoints="waypoints"/>
    </l-map>
  </div>
</template>

<script>
// @ is an alias to /src

import {latLng} from "leaflet";
import {Locator} from "@/services/locator";
import MapConfig from "@/assets/map-config.json"
import LRoutingMachine from '@/components/LRoutingMachine'
import {LMap, LTileLayer, LMarker, LPopup, LIcon} from 'vue2-leaflet';

export default {
  name: 'Home',
  props: {
    occasions: Array
  },
  data() {
    return {
      url: MapConfig.url,
      zoom: MapConfig.zoom,
      center: latLng(MapConfig.center.lat, MapConfig.center.lon),
      currentZoom: MapConfig.zoom,
      currentCenter: latLng(MapConfig.center.lat, MapConfig.center.lon),
      mapOptions: MapConfig.mapOptions,
      newOccasion: null,
      waypoints: [
        // { lat: 38.7436056, lng: -9.2304153 },
        // { lat: 38.7436056, lng: -0.131281 }
      ]
    };
  },
  methods: {
    async setCenter() {
      this.locator = new Locator();
      this.center = await this.locator.getPosition();
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    async resetMap() {
      this.$refs.roadMap.setZoom(this.zoom);
      this.$refs.roadMap.setCenter(this.center);
    },
    addMarker(e) {
      // this.newOccasion = e.latlng;
      if (this.waypoints.length > 1) {
        this.waypoints = this.waypoints.slice(1,);
      }
      this.waypoints.push(e.latlng);
      console.log(this.waypoints);
    }
  },
  components: {
    LRoutingMachine,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon
  }
}
</script>

<style scoped>
.map-container {
  height: 100%;
}

.card {
  border: none !important;
}

.leaflet-container a {
  color: black !important;
  margin-right: 15px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);;
}
</style>