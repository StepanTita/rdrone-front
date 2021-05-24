import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Comments from "@/views/Comments";
import Occasion from "@/views/Occasion";
import AddOccasion from "@/views/AddOccasion";
import About from "@/views/About";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/comments/:occasion_id',
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
]

const router = new VueRouter({
  routes
})

export default router
