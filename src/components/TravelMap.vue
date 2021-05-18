<template>
  <div class="map-container">
    <l-map
        style="height: 80%; width: 100%"
        ref="roadMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        @ready="setCenter"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
        id="roadMap"

    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker v-for="marker in markers" :lat-lng="marker">
        <l-popup>
          Hello
        </l-popup>
      </l-marker>
    </l-map>
    <!--    <div id="roadMap" style="height: 80%; width: 100%"></div>-->
    <van-grid clickable :column-num="3">
      <van-grid-item text="Start" icon="play-circle-o" @click=""/>
      <van-grid-item text="Pause" icon="pause-circle-o" @click=""/>
      <van-grid-item text="Reset" icon="replay" @click="resetMap"/>
    </van-grid>
  </div>
</template>

<script>
// @ is an alias to /src

import {latLng} from "leaflet";
import {Locator} from "@/services/locator";
import MapConfig from "@/assets/map-config.json"

export default {
  name: 'Home',
  data() {
    return {
      url: MapConfig.url,
      zoom: MapConfig.zoom,
      center: latLng(MapConfig.center.lat, MapConfig.center.lon),
      currentZoom: MapConfig.zoom,
      currentCenter: latLng(MapConfig.center.lat, MapConfig.center.lon),
      mapOptions: MapConfig.mapOptions,
      markers: []
    };
  },
  mounted() {
    this.setOccasion();
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
    setOccasion() {
      this.markers.push(this.center);
    }
  }
}
</script>

<style scoped>
.map-container {
  height: 100%;
}

#roadMap {
  height: 100%;
}
</style>