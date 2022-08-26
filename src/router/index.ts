import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue'
import RestaurantMap from '@/views/RestaurantMapPage.vue';
import Restaurant from '@/views/RestaurantPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/restaurantMap',
    name: 'RestaurantMap',
    component: RestaurantMap
  },
  {
    path: '/restaurant/:no',
    name: 'Restaurant',
    component: Restaurant
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
