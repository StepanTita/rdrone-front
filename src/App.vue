<template>
  <div id="app">
    <van-notify v-model="showAlert" v-bind:type="alertType">
      <van-icon name="bell" style="margin-right: 4px;"/>
      <span>{{ alertText }}</span>
    </van-notify>
    <van-nav-bar
        title="RDrONE"
        left-text="Back"
        right-text="Next"
        left-arrow
    />
    <router-view/>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="navigate('/')">Home</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="navigate('/about')">Add</van-tabbar-item>
      <van-tabbar-item icon="setting-o">Settings</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import config from "@/assets/config.json"
import {AlertService} from "@/services/alerts/alerts";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {EventBus} from "@/services/common/eventBus";

export default {
  name: 'rdrone-app',
  data() {
    return {
      alertType: '',
      alertText: '',
      active: 0,
      showAlert: false,
    }
  },
  created() {
    EventBus.$on(SHOW_ALERT_EVENT, this.setupAlert);
  },
  mounted() {
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
      }, config.alert_timeout)
    },
    navigate(path) {
      this.$router.push(path);
    },
  },
}
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

</style>
