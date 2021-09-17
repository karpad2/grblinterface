import Vue from 'vue';
import router from './router';
import ForkeMeOnGithub from 'fork-me-on-github-vue';
import {IconsPlugin } from 'bootstrap-vue';
import BootstrapVue from "bootstrap-vue";
import VueNoty from 'vuejs-noty';
import VCalendar from 'v-calendar';
import AudioRecorder from 'vue-audio-recorder';
import VueMaterial from 'vue-material'; // TODO: import only needed component, not all
import 'vue-material/dist/vue-material.min.css';
Vue.use(VueMaterial);
//Vue.use(ForkeMeOnGithub);


 
Vue.use(AudioRecorder);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";


Vue.use(VCalendar, {})

Vue.use(VueNoty, {
	timeout: 4000,
	progressBar: true,
	layout: 'topRight'
});



import App from './App.vue';
let app = null;
Vue.config.productionTip = false;

import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
	if (!app) {
		app = new Vue({
			router,
			render: h => h(App)
		});
		//app.use(BootstrapIconsPlugin);
		app.$mount('#app');
	}
});