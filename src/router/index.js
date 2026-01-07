import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NavicoPriceSystem from "../components/NavicoPriceSystem.vue";
import AntalPriceNew from "../components/AntalPriceNew.vue";
import NavicoAFourPage from "../components/NavicoAFourPage.vue";
import AntalAFour from "../components/AntalAFour.vue";
import NavicoUSD from "../components/NavicoUSD.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/navico",
    name: "Navico",
    component: NavicoPriceSystem,
  },
  {
    path: "/navicousd",
    name: "Navicousd",
    component: NavicoUSD,
  },

  {
    path: "/antalnew",
    name: "Antalnew",
    component: AntalPriceNew,
  },
    {
    path: "/navicoafour",
    name: "NavicoAFour",
    component: NavicoAFourPage,
  },
  {
    path: "/antalafour",
    name: "AntalAFour",
    component: AntalAFour,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
