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
      <l-control>
        <van-button plain class="map-control create-occasion-control" v-on:click="showSearch=true"><van-icon size="20" name="fail" />
<!--          <van-popover-->
<!--              v-model="showSearch"-->
<!--              trigger="click"-->
<!--              placement="bottom-start"-->
<!--          >-->
<!--            <p>Hello</p>-->
<!--          </van-popover>-->
        </van-button>
      </l-control>
      <l-control>
        <van-button plain class="map-control create-waypoints-control"><van-icon size="20" name="location-o" /></van-button>
      </l-control>
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
      <l-routing-machine v-bind:waypoints="waypoints" v-bind:showAlternatives="showAlternatives"
                         v-bind:alt-line-options="altLineOptions"/>
    </l-map>
    <van-action-sheet v-model="showSearch" title="Add new occasion">
      <search-destination v-bind:search-query="searchQuery"></search-destination>
    </van-action-sheet>
  </div>
</template>

<script>
// @ is an alias to /src

import {latLng} from "leaflet";
import {Locator} from "@/services/locator";
import MapConfig from "@/assets/map-config.json"
import LRoutingMachine from '@/components/LRoutingMachine'
import {LMap, LTileLayer, LMarker, LPopup, LIcon, LControl} from 'vue2-leaflet';
import SearchDestination from "@/components/SearchDestination";

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

      showAlternatives: true,
      altLineOptions: {
        styles: [{color: 'black', opacity: 0.3, weight: 8}]
      },

      // search
      searchQuery: '',
      showSearch: false,

      newOccasion: null,
      waypoints: []
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
      if (this.waypoints.length > 1) {
        this.waypoints = this.waypoints.slice(1,);
      }
      this.waypoints.push(e.latlng);
    },
  },
  components: {
    LRoutingMachine,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    LControl,
    SearchDestination
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
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.map-control {
  z-index: 1000 !important;
  border: none !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  width: 35px;
  height: 33px;
}

.create-waypoints-control {
  color: darkblue;
}

.create-occasion-control {
  color: darkred;
}
</style>