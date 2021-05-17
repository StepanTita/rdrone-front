<template>
  <div id="app">
    <Alert v-bind:class="this.alertClass" v-bind:text="this.alertText"/>
    <van-nav-bar
        title="RDrONE"
        left-text="Back"
        right-text="Next"
        left-arrow
    />
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o"><router-link to="/">Home</router-link></van-tabbar-item>
      <van-tabbar-item icon="search"><router-link to="/about">About</router-link></van-tabbar-item>
      <van-tabbar-item icon="friends-o"><router-link to="/comments">Comments</router-link></van-tabbar-item>
      <van-tabbar-item icon="setting-o">Tab</van-tabbar-item>
    </van-tabbar>
    <router-view/>
  </div>
</template>

<script>
import config from "@/assets/config.json"
import Alert from "@/components/Alert"
import {AlertService} from "@/services/alerts/alerts";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {EventBus} from "@/services/common/eventBus";
export default {
  name: 'rdrone-app',
  data() {
    return {
      activeKey: 0,
      alertClass: '',
      alertText: '',
      active: 0
    }
  },
  created() {
    EventBus.$on(SHOW_ALERT_EVENT, this.onAlert);
  },
  mounted() {
    this.alertService = new AlertService();
  },
  methods: {
    onAlert(data) {
      console.log("Emitted");
      this.setupAlert(data);
    },
    setupAlert(data) {
      [this.alertClass, this.alertText] = this.alertService.ShowAlert(data);
      setTimeout(() => {
        this.alertClass = '';
        this.alertText = '';
      }, config.alert_timeout)
    }
  },
  components: {
    Alert
  }
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
</style>
