import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Vant from 'vant';
import 'vant/lib/index.css';
import * as VueGoogleMaps from 'vue2-google-maps';
import {Locale} from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
import config from '@/assets/config.json';

Vue.use(Vant);
Vue.use(VueGoogleMaps, {
    load: {
        key: config.google_api_key,
        libraries: 'places',
    },
});

Locale.use('en-US', enUS);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
