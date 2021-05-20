<template>
  <div>
    <van-search v-model="searchQuery" placeholder="Type some text here..."/>
    <van-list
        v-model="searchLoading"
        :finished="searchFinished"
        finished-text="Finished"
        @load="onLoad"
    >
      <van-cell v-for="item in searchResult" :key="item" :title="item"/>
    </van-list>
  </div>
</template>

<script>
import {Geoencorder} from "@/services/geoencoder/geoencorder";

export default {
  name: 'SearchDestination',
  props: {
    searchQuery: '',
  },
  mounted() {
    this.geoencoder = new Geoencorder();
  },
  data() {
    return {
      searchLoading: false,
      searchFinished: false,
      searchResult: [],
    };
  },
  methods: {
    async onLoad() {
      let res = await this.geoencoder.getGeo(this.searchQuery, 1);
      console.log(res)
      this.searchResult = res;
      this.searchLoading = false;
    },
  }
};
</script>