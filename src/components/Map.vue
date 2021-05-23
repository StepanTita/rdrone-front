<template>
  <div class="map-container">
    <div class="search-autocomplete-container d-flex justify-content-center">
      <div class="search-autocomplete-input input-group">
        <GmapAutocomplete
            placeholder="Search..."
            @place_changed='setPlace'
            class="form-control"
            :value="searchLocation"
        />
        <button type="button" class="search-clear-button btn bg-transparent" v-on:click="clearSearch">
          <van-icon name="cross"/>
        </button>
        <div class="input-group-append">
          <button type="button" class="btn btn-primary">
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="map-controls-container d-flex flex-row-reverse" v-if="showRoutesControl">
      <van-button plain>
        <van-icon name="location-o" @click="openDetailedRoute"/>
      </van-button>
    </div>
    <GmapMap
        :center="center"
        :zoom="zoom"
        :options="mapOptions"
        ref="map"
        @click="addMarker"
        map-type-id="roadmap"
        style="height: 100%; width: 100%"
    >
      <GmapMarker
          :key="m.Id()"
          v-for="m in occasions"
          :position="m.Position()"
          :clickable="true"
          :draggable="false"
          @click="openOccasionInfo(m)"
      />
      <info-window v-bind:info-window="infoWindow" v-bind:options="infoWindowOptions"/>

      <GmapMarker
          v-if="newOccasion"
          :key="'occasion-' + newOccasion.Id()"
          :position="newOccasion.Position()"
          :clickable="true"
          :draggable="true"
          :icon="{ url: require('@/assets/images/pin.png')}"
      />

      <GmapMarker
          :key="'waypoint-' + m.Id()"
          v-for="m in waypoints"
          :position="m.Position()"
          :clickable="true"
          :draggable="true"
          :label="m.Style()"
          @click="routing.attachInstructionText"
      />

    </GmapMap>
    <van-action-sheet v-model="showDirections"
                      close-on-click-action
                      cancel-text="Cancel"
                      title="Route">
      <div ref="instructionsPanel">
        <p>Total Distance: <span id="total">{{ totalDistance }}</span></p>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import MapConfig from "@/assets/map-config.json";
import {latLng} from "leaflet";
import * as Mode from "@/services/common/mode";
import {Toast} from "vant";
import {Marker} from "@/services/map/marker";
import InfoWindow from "@/components/InfoWindow";
import {Routing} from "@/services/routing/routing";
import {Waypointing} from "@/services/waypointing/waypointing";
import {DIRECTIONS_CHANGED_EVENT} from "@/services/common/events";

export default {
  name: 'Map',
  components: {InfoWindow},
  props: {
    occasions: Array
  },
  updated() {
    if (this.showDirections) {
      this.routing.dR.setPanel(this.$refs.instructionsPanel);
    }
  },
  created() {
    this.waypointing = new Waypointing();
  },
  async mounted() {
    const gmapApi = await this.$gmapApiPromiseLazy();

    let dS = new gmapApi.maps.DirectionsService;
    let dR = new gmapApi.maps.DirectionsRenderer({
      draggable: true,
      map: this.$refs.map.$mapObject,
    });

    dR.addListener(DIRECTIONS_CHANGED_EVENT, () => {
      this.totalDistance = this.routing.computeTotalDistance(dR.getDirections());
    });

    this.routing = new Routing(this.$refs.map.$mapObject, dS, dR);
    this.waypointing.setRouting(this.routing);
  },
  data() {
    return {
      // map
      zoom: MapConfig.zoom,
      center: latLng(MapConfig.center.lat, MapConfig.center.lon),
      mapOptions: MapConfig.mapOptions,

      // locating
      currentPlace: null,

      //search
      searchLocation: '',

      // occasions
      newOccasion: null,

      // info window
      infoWindow: null,
      infoWindowOptions: {
        open: false,
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
      },

      // directions
      showDirections: false,
      showRoutesControl: false,
      totalDistance: '0 km',

      waypoints: [],

      // common
      mode: Mode.MODE_WAYPOINTS
    };
  },
  methods: {
    // map
    setPlace(place) {
      this.zoom = MapConfig.zoom;
      this.currentPlace = place;
      this.center = place.geometry.location;
      this.zoom = this.zoom * 1.2;
    },

    // controls
    addWaypoints(w) {
      if (this.waypoints.length > 0) {
        this.showRoutesControl = true;
      }
      this.waypoints = this.waypointing.add(w);
    },
    addOccasion(o) {
      this.newOccasion = new Marker(this.next(), o.latLng);
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
          console.log(e, 'default mode');
      }
    },
    openOccasionInfo(o) {
      this.center = o.Position();
      this.infoWindow = o;
      this.infoWindowOptions.open = true;
    },

    // directions
    openDetailedRoute() {
      this.showDirections = true;
    },

    // modes
    changeMode(newMode) {
      if (newMode === this.mode) {
        this.mode = Mode.MODE_DEFAULT;
      } else {
        this.mode = newMode;
      }
      Toast.success(this.mode.toUpperCase());
    },

    // common
    // todo: fixme
    clearSearch() {
      this.searchLocation = null;
    },
  },
};
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
}

.search-autocomplete-input {
  width: 70% !important;
}

.search-autocomplete-container {
  width: 100%;
  /*height: 35px;*/

  margin-top: 15%;

  position: fixed;

  z-index: 2000;
}

.search-clear-button {
  margin-left: -40px;

  z-index: 100;

  font-weight: 100;

  opacity: 0.3;

  line-height: 5px;
}

.map-controls-container {
  width: 100%;

  position: fixed;
  margin: 15% 0 10px;

  z-index: 2000;
}

.map-controls-container button {
  width: 40px;
  height: 40px;

  margin-right: 10px;

  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.5);

  font-size: 20px;
}

</style>