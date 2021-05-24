<template>
  <div class="occasion">
    Hello, world
    {{ occasion }}
  </div>
</template>

<script>
// @ is an alias to /src

import {OccasionsQuerier} from "@/services/occasions/occasions";
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";

export default {
  name: 'Occasion',
  data() {
    return {
      occasion: null
    }
  },
  async mounted() {
    console.log(this.$route.params.occasion_id);
    this.occasionsQuerier = new OccasionsQuerier();
    this.occasionsQuerier.getOccasion(this.$route.params.occasion_id).then((resp) => {
      EventBus.$emit(SHOW_ALERT_EVENT, resp);
      this.occasion = resp.data;
    });
  },
}
</script>
