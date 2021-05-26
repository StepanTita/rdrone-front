<template>
  <div class="home">
    <Map v-bind:occasions="occasions" v-bind:incidents="incidents"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Map from "@/components/Map/Map";
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {OccasionsQuerier} from "@/services/occasions/occasionsQuerier";
import {Locator} from "@/services/locator";
import {Marker} from "@/services/map/marker";
// todo use google method
import {latLng} from "leaflet/dist/leaflet-src.esm";
import MapConfig from "@/assets/map-config.json";
import {IncidentsQuerier} from "@/services/incidents/incidentsQuerier";
import {OccasionData} from "@/services/map/occasion";
import {IncidentData} from "@/services/map/incident";
import {err} from "@/services/common/errors";

export default {
  name: 'Home',
  data() {
    return {
      occasions: [],
      incidents: [],
    };
  },
  async mounted() {
    this.occasionsQuerier = new OccasionsQuerier();
    await this.updateOccasions();

    this.incidentsQuerier = new IncidentsQuerier(MapConfig.incidentsBoundingBox);
    this.updateIncidents();
  },
  methods: {
    // todo: refactor to single method for all queriers
    async updateOccasions() {
      // todo: remove
      this.locator = new Locator();
      const center = await this.locator.getPosition();

      this.occasionsQuerier.getOccasions().then((resp) => {
        if (!resp.StatusOK()) {
          Promise.reject(resp.Status());
        }
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        for (let o of resp.data) {
          this.occasions.push(new Marker(o.id, latLng({lat: o.lat, lng: o.lng}), new OccasionData(o)));
        }
        this.occasions.push(new Marker(1, latLng({lat: center.lat, lng: center.lng})));
      }).catch(err);
    },

    updateIncidents() {
      this.incidentsQuerier.getIncidents().then((resp) => {
        if (!resp.StatusOK()) {
          Promise.reject(resp.Status());
        }
        for (let o of resp.data) {
          this.incidents.push(new Marker(o.id, latLng({lat: o.lat, lng: o.lng}), new IncidentData(o)));
        }
      }).catch(err);
    }
  },
  components: {
    Map
  }
};
</script>

<style scoped>
.home {
  height: 85% !important;
}
</style>