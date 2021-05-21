<template>
  <div>
    <van-action-sheet v-model="showActionSheet" title="Search">
      <div class="search-container">
        <GmapAutocomplete
            @place_changed='setPlace'
        />
        <button @click='addMarker'>Add</button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import {ADD_MARKER_EVENT, SET_PLACE_EVENT} from "@/services/common/events";

export default {
  Name: 'SearchAutocomplete',
  emits: ['select-location', 'set-place'],
  data() {
    return {
      showActionSheet: true,
    };
  },
  methods: {
    setPlace(e) {
      this.$emit(SET_PLACE_EVENT, e);
    },
    addMarker(e) {
      this.$emit(ADD_MARKER_EVENT, e);
    }
  }
};
</script>

<style scoped>
.search-container {
  height: 500px;
}
</style>