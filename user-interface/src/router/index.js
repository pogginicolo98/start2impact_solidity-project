import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Marketplace from "../views/Marketplace.vue";
import Faucet from "../views/Faucet.vue";
import Mint from "../views/Mint.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/marketplace",
    name: "Marketplace",
    component: Marketplace,
  },
  {
    path: "/faucet",
    name: "Faucet",
    component: Faucet,
  },
  {
    path: "/mint",
    name: "Mint",
    component: Mint,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
