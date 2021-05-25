import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Comments from "@/views/Comments";
import Occasion from "@/views/Occasion";
import AddOccasion from "@/views/AddOccasion";
import About from "@/views/Settings";
import {USER_DATA_KEY} from "@/services/common/storate";
import {EventBus} from "@/services/common/eventBus";
import * as Events from "@/services/common/events";
import Login from "@/views/Login";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/sign-in',
        name: 'SignIn',
        component: Login,
        props: {currentComponent: 'SignIn'}
    },
    {
        path: '/sign-up',
        name: 'SignUp',
        component: Login,
        props: {currentComponent: 'SignUp'}
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/Comments/:occasion_id',
        name: 'Comments',
        component: Comments
    },
    {
        path: '/occasion/add',
        name: 'Details',
        component: AddOccasion
    },
    {
        path: '/occasion/details/:occasion_id',
        name: 'Details',
        component: Occasion
    },
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    let isAuthenticated = false;
    isAuthenticated = !!localStorage.getItem(USER_DATA_KEY);
    if (to.name === 'SignUp') {
        next();
    } else if (to.name !== 'SignIn' && !isAuthenticated) {
        next('/sign-in');
    } else {
        EventBus.$emit(Events.USER_SIGNED_IN_EVENT);
        next();
    }
});

export default router;
