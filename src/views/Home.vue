<template>
  <div class="home">
    <Map v-bind:occasions="occasions"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Map from "@/components/Map";
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {OccasionsQuerier} from "@/services/occasions/occasions";
import {Locator} from "@/services/locator";
import {Marker} from "@/services/map/marker";
import {latLng} from "leaflet/dist/leaflet-src.esm";

export default {
  name: 'Home',
  data() {
    return {
      occasions: []
    };
  },
  async mounted() {
    this.occasionsQuerier = new OccasionsQuerier();
    await this.updateOccasions();
  },
  methods: {
    async updateOccasions() {
      // todo: remove
      this.locator = new Locator();
      const center = await this.locator.getPosition();

      this.occasionsQuerier.getOccasions().then((resp) => {
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        for (let o of resp.data) {
          this.occasions.push(new Marker(o.id, latLng({lat: o.lat, lng: o.lng}), o));
        }
        this.occasions.push(new Marker(1, latLng({lat: center.lat, lng: center.lng})));
        console.log(this.occasions);
      });
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