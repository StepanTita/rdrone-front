<template>
  <div class="map-container">
    <GmapAutocomplete
        @place_changed='setPlace'
    />
    <GmapMap
        :center="center"
        :zoom="zoom"
        map-type-id="roadmap"
        style="height: 100%; width: 100%"
    >
      <GmapMarker
          :key="index"
          v-for="(m, index) in occasions"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center=m.position"
      />
    </GmapMap>
    <search-autocomplete v-on:set-place="setPlace" v-on:add-marker="addMarker"/>
  </div>
</template>

<script>
import MapConfig from "@/assets/map-config.json";
import {latLng} from "leaflet";
import * as Mode from "@/services/common/mode";
import {Toast} from "vant";
import SearchAutocomplete from "@/components/SearchAutocomplete";

export default {
  name: 'Map',
  components: {SearchAutocomplete},
  props: {
    occasions: Array
  },
  data() {
    return {
      // map
      zoom: MapConfig.zoom,
      center: latLng(MapConfig.center.lat, MapConfig.center.lon),
      mapOptions: MapConfig.mapOptions,

      // locating
      currentPlace: null,
    };
  },
  methods: {
    // map
    setPlace(place) {
      this.currentPlace = place;
    },

    // controls
    addWaypoints(w) {
      if (this.waypoints.length > 1) {
        this.waypoints = this.waypoints.slice(1,);
      }
      this.waypoints.push(w.latlng);
    },
    addOccasion(o) {
      this.newOccasion = o.latlng;
    },
    addMarker(e) {
      switch (this.mode) {
        case Mode.MODE_WAYPOINTS:
          this.addWaypoints(e);
          break;
        case Mode.MODE_OCCASIONS:
          this.addOccasion(e);
          break;
        default:
          console.log("default mode");
      }
    },

    // modes
    changeMode(newMode) {
      if (newMode === this.mode) {
        this.mode = Mode.MODE_DEFAULT;
      } else {
        this.mode = newMode;
      }
      Toast.success(this.mode.toUpperCase());
    }

  }
};
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
}
</style>