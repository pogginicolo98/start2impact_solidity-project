import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Marketplace from "@/views/Marketplace.vue";
import Faucet from "@/views/Faucet.vue";
import Profile from "@/views/Profile.vue";
import NFTDetail from "@/views/NFTDetail.vue";
import PageNotFound from "@/views/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/merchant",
    name: "Marketplace",
    component: Marketplace,
  },
  {
    path: "/welcome-chest",
    name: "Faucet",
    component: Faucet,
  },
  {
    path: "/den",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/merchant/:tokenId",
    name: "NFTDetail",
    component: NFTDetail,
    props: true
  },
  {
    path: "*",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
