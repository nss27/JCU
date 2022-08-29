import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import RestaurantListMap from "@/views/RestaurantListMapPage.vue";
import RestaurantPage from "@/views/RestaurantPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/restaurantListMap",
    name: "RestaurantListMap",
    component: RestaurantListMap,
  },
  {
    path: "/restaurant/:no",
    name: "Restaurant",
    component: RestaurantPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
