import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import RestaurantListPage from "@/views/RestaurantListPage.vue";
import RestaurantPage from "@/views/RestaurantPage.vue";
import CharactorLookalikePage from "@/views/CharactorLookalikePage.vue";
import OpenSourceLicenseListPage from "@/views/OpenSourceLicenseListPage.vue";
import OpenSourceLicensePage from "@/views/OpenSourceLicensePage.vue";
import OpenApiListPage from "@/views/OpenApiListPage.vue";
import CyPlayerMatchesPage from "@/views/CyPlayerMatchesPage.vue";
import CyItemInfoPage from "@/views/CyItemInfoPage.vue";
import CyPositionInfoPage from "@/views/CyPositionInfoPage.vue";
import CyTotalRankingPage from "@/views/CyTotalRankingPage.vue";
import CyCharacterRankingPage from "@/views/CyCharacterRankingPage.vue";
import CyPlayerInfoPage from "@/views/CyPlayerInfoPage.vue";
import CyTsjRankingPage from "@/views/CyTsjRankingPage.vue";
import CyItemSearchPage from "@/views/CyItemSearchPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/restaurantList",
    component: RestaurantListPage,
  },
  {
    path: "/restaurant/:no",
    component: RestaurantPage,
  },
  {
    path: "/charactorLookalike",
    component: CharactorLookalikePage,
  },
  {
    path: "/openSourceLicenseList",
    component: OpenSourceLicenseListPage,
  },
  {
    path: "/openSourceLicense/:index",
    component: OpenSourceLicensePage,
  },
  {
    path: "/openApiList",
    component: OpenApiListPage,
  },
  {
    path: "/matches/:matchId",
    component: CyPlayerMatchesPage,
  },
  {
    path: "/itemInfo/:itemId",
    component: CyItemInfoPage,
  },
  {
    path: "/positionInfo/:attributeId",
    component: CyPositionInfoPage,
  },
  {
    path: "/totalRanKing/:searchWord?",
    component: CyTotalRankingPage,
  },
  {
    path: "/characterRanKing/:characterId/:rankingType/:searchWord?",
    component: CyCharacterRankingPage,
  },
  {
    path: "/playerInfo/:searchWord?",
    component: CyPlayerInfoPage,
  },
  {
    path: "/tsjRanking/:searchWord?",
    component: CyTsjRankingPage,
  },
  {
    path: "/itemSearch/:searchWord?",
    component: CyItemSearchPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      const el = document.getElementById(to.hash.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  },
});

export default router;
