<template>
  <div id="app">
    <van-notify v-model="showAlert" v-bind:type="alertType">
      <van-icon name="bell" style="margin-right: 4px;"/>
      <span>{{ alertText }}</span>
    </van-notify>
    <van-nav-bar
        title="RDrONE"
    />
    <router-view/>
    <van-tabbar v-model="active" v-show="signedIn">
      <van-tabbar-item icon="home-o" @click="navigate('/')">Home</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="navigateWithQuery('/occasion/add', newOccasion)">Add</van-tabbar-item>
      <van-tabbar-item icon="setting-o" @click="navigate('/settings')">Settings</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import config from "@/assets/config.json";
import {AlertService} from "@/services/alerts/alerts";
import * as Events from "@/services/common/events";
import {EventBus} from "@/services/common/eventBus";
import {Toast} from "vant";
import {SHOW_ALERT_EVENT, USER_SIGNED_IN_EVENT} from "@/services/common/events";

export default {
  name: 'rdrone-app',
  data() {
    return {
      alertType: '',
      alertText: '',
      active: 0,
      currActive: 0,
      showAlert: false,

      newOccasion: null,

      signedIn: false,
    };
  },
  created() {
    EventBus.$on(Events.SHOW_ALERT_EVENT, this.setupAlert);
    EventBus.$on(Events.ADD_NEW_OCCASION_EVENT, o => {
      this.newOccasion = o;
    });
  },
  updated() {
    this.signedIn = !!localStorage.getItem('USER_DATA')
  },
  mounted() {
    this.signedIn = !!localStorage.getItem('USER_DATA')
    this.alertService = new AlertService();
  },
  methods: {
    setupAlert(data) {
      [this.alertType, this.alertText] = this.alertService.ShowAlert(data);
      this.showAlert = true;
      setTimeout(() => {
        this.alertType = '';
        this.alertText = '';
        this.showAlert = false;
      }, config.alert_timeout);
    },

    navigate(path) {
      this.currActive = this.active;
      this.$router.push(path);
    },
    navigateWithQuery(path, marker) {
      if (marker) {
        console.log({latLng: `${marker.latLng.lat()},${marker.latLng.lng()}`});
        this.$router.push({path: path, query: {latLng: `${marker.latLng.lat()},${marker.latLng.lng()}`}});
        this.currActive = this.active;
        return
      }
      this.active = this.currActive;
      Toast.fail('You must choose new occasion location first');
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.van-nav-bar.van-hairline--bottom {
  height: 5% !important;
  min-height: 44px;
}

.van-tabbar {
  height: 10% !important;
  min-height: 50px !important;
}

/*.van-hairline--top-bottom.van-tabbar.van-tabbar--fixed {*/
/*  position: relative !important;*/
/*}*/

*:focus {
  outline: none;
}

</style>
