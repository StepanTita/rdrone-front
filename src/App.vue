<template>
  <div id="app">
    <Alert v-bind:class="this.alertClass" v-bind:text="this.alertText"/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/comments">Comments</router-link>
    </div>
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
      alertClass: '',
      alertText: ''
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
