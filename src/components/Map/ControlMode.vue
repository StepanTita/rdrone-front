<template>
  <van-button plain class="map-control" @click="changeMode">
    <van-icon v-bind:name="getIcon(modeName)"/>
  </van-button>
</template>

<script>
import * as Mode from "@/services/common/mode";
import {Toast} from "vant";
import {MODE_CHANGE_EVENT} from "@/services/common/events";
import {ItemsIterator} from "@/services/common/iterator";

export default {
  Name: 'ControlMode',
  props: {
    modeName: String
  },
  mounted() {
    this.modeIterator = new ItemsIterator([Mode.MODE_DEFAULT, Mode.MODE_WAYPOINTS, Mode.MODE_OCCASIONS]);
  },
  methods: {
    getIcon(m) {
      switch (m) {
        case Mode.MODE_WAYPOINTS:
          return 'cluster-o'
        case Mode.MODE_OCCASIONS:
          return 'flag-o'
        default:
          return 'weapp-nav'
      }
    },
    changeMode() {
      this.modeName = this.modeIterator.next();
      this.$emit(MODE_CHANGE_EVENT, this.modeName);
      Toast.success(this.modeName.toUpperCase());
    },
  }
}
</script>
