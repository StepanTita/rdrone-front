<template>
  <div>
    <input type="text" v-model="location">
    <ul>
      <li v-for="(result, i) in searchResults" :key="i">
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script>
import config from "@/assets/config.json";
import {encodeQueryData} from "@/services/common/encoding";

export default {
  data: () => ({
    location: '',
    searchResults: [],
    service: null // will reveal this later 🕵️
  }),
  mounted() {
    this.MapsInit();
  },
  methods: {
    MapsInit() {
      this.service = new window.google.maps.places.AutocompleteService();
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.searchResults = [];
        return;
      }
      this.searchResults = predictions.map(prediction => prediction.description);
    }
  },
  watch: {
    location(newValue) {
      if (newValue) {
        this.service.getPlacePredictions({
          input: this.location,
          types: ['(regions)'],
        }, this.displaySuggestions);
      }
    }
  }
};
</script>