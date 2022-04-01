import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Marketplace from "@/views/Marketplace.vue";
import Faucet from "@/views/Faucet.vue";
import Profile from "@/views/Profile.vue";
import NftDetails from "@/views/NftDetails.vue";
import PageNotFound from "@/views/PageNotFound.vue";

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
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/marketplace/:tokenId",
    name: "NftDetails",
    component: NftDetails,
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
