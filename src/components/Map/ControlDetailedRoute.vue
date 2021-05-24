<template>
  <van-button plain v-if="showRoutesControl" class="map-control" @click="openDirectionsPanel">
    <van-icon name="location-o"/>
  </van-button>
</template>

<script>
import {SHOW_DIRECTIONS_EVENT} from "@/services/common/events";

export default {
  Name: 'ControlDetailedRoute',
  props: {
    showRoutesControl: Boolean,
    showDirections: Boolean,
  },
  methods: {
    openDirectionsPanel() {
      this.showDirections = true;
      this.$emit(SHOW_DIRECTIONS_EVENT, this.showDirections);
    }
  }
};
</script>
