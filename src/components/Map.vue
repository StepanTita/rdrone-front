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
    <GmapMap
        :center="center"
        :zoom="zoom"
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
      <gmap-info-window
          v-if="infoWindow"
          :opened="infoWindowOpen"
          :options="infoOptions"
          :position="infoWindow.Position()"
          @closeclick="infoWindowOpen=false"
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

      <GmapMarker
          v-if="newOccasion"
          :key="'occasion-' + newOccasion.Id()"
          :position="newOccasion.Position()"
          :clickable="true"
          :draggable="true"
          :icon="{ url: require('../assets/images/pin.png')}"
      />

      <GmapMarker
          :key="'waypoint-' + m.Id()"
          v-for="m in waypoints"
          :position="m.Position()"
          :clickable="true"
          :draggable="true"
          :label="m.Style()"
          @click="attachInstructionText"
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
import {WaypointIterator} from "@/services/common/iterator";

export default {
  name: 'Map',
  props: {
    occasions: Array
  },
  updated() {
    if (this.showDirections) {
      this.dR.setPanel(this.$refs.instructionsPanel);
    }
  },
  async mounted() {
    this.waypointIterator = new WaypointIterator("AB");
    const gmapApi = await this.$gmapApiPromiseLazy();

    this.dS = new gmapApi.maps.DirectionsService;
    this.dR = new gmapApi.maps.DirectionsRenderer({
      draggable: true,
      map: this.$refs.map.$mapObject,
    });

    this.dR.addListener("directions_changed", () => {
      this.computeTotalDistance(this.dR.getDirections());
    });

    this.idCounter = 0;

    this.routeMarkers = [];
  },
  data() {
    return {
      // map
      zoom: MapConfig.zoom,
      center: latLng(MapConfig.center.lat, MapConfig.center.lon),
      mapOptions: {
        fullscreenControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        disableDefaultUi: false,
      },

      // locating
      currentPlace: null,

      //search
      searchLocation: '',

      // occasions
      newOccasion: null,
      waypoints: [],

      // info window
      infoWindow: null,
      infoWindowOpen: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },

      // directions
      showDirections: false,
      totalDistance: "0 km",
      routeSteps: null,

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
      const style = {
        color: "#FFF",
        text: this.waypointIterator.next(),
      };

      if (this.waypoints.length > 1) {
        this.waypoints = this.waypoints.slice(1,);
      }

      this.waypoints.push(new Marker(this.next(), w.latLng, null, style));

      if (this.waypoints.length > 1) {
        this.calculateAndDisplayRoute(this.waypoints[0].Position(), this.waypoints[1].Position());
      }
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
          console.log(e, "default mode");
      }
    },
    openOccasionInfo(o) {
      this.center = o.Position();
      this.infoWindow = o;
      this.infoWindowOpen = true;
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
    clearSearch() {
      console.log(this.searchLocation);
      this.searchLocation = null;
    },
    next() {
      return this.idCounter++;
    },

    // directions
    clearRoute() {
      for (let m of this.routeMarkers) {
        m.setMap(null);
      }
    },
    calculateAndDisplayRoute(start, destination) {
      this.clearRoute();

      this.dS.route({
        origin: start,
        destination: destination,
        travelMode: 'DRIVING',
        avoidTolls: true,
        provideRouteAlternatives: true,
        optimizeWaypoints: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: 'pessimistic'
        },
      }, (response, status) => {
        if (status === 'OK') {
          this.dR.setDirections(response);
          this.showDirections = true;
          this.showSteps(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
      this.waypoints.length = 0;
    },
    showSteps(directionResult) {
      let myRoute = directionResult.routes[0].legs[0];

      for (let i = 0; i < myRoute.steps.length; i++) {
        let marker = new google.maps.Marker({
          position: myRoute.steps[i].start_point,
          map: this.$refs.map.$mapObject,
          optimized: true,
          icon: require('../assets/images/route-pin.png')
        });
        marker.addListener("click", () => {
          this.attachInstructionText(marker, myRoute.steps[i].instructions);
        });
        this.routeMarkers.push(marker);
      }
    },
    attachInstructionText(m, text) {
      this.center = m.position;
      let stepDisplay = new google.maps.InfoWindow();
      stepDisplay.setContent(text);
      stepDisplay.open(this.$refs.map.$mapObject, m);
    },
    computeTotalDistance(result) {
      let total = 0;
      const myroute = result.routes[0];

      if (!myroute) {
        return;
      }

      for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
      }
      total = total / 1000;
      this.totalDistance = total + " km";
    }
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
</style>