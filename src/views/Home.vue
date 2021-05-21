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

export default {
  name: 'Home',
  data() {
    return {
      occasions: []
    }
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
        resp.data.push({
          lat: center.lat,
          lng: center.lng,
          id: 1,
        });
        this.occasions = resp.data;
      });
    }
  },
  components: {
    Map
  }
}
</script>

<style scoped>
.home {
  height: 85% !important;
}
</style>