import Index from "views/Index.js";
import Users from "views/examples/Users.js";
import Companies from "views/examples/Companies";
import Packages from "views/examples/Packages";
import Discounts from "views/examples/Discounts";
import Restaurant from "views/examples/Restaurant";
import Orders from "views/examples/Orders";
import Blocks from "views/examples/Blocks";
import DeliveryPerson from "views/examples/DeliveryPerson";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Translation from "Utilities/translation";

var routes = [
  {
    path: "/user-profile",
    name: Translation["Users"],
    icon: "ni ni-single-02 text-yellow",
    component: Users,
    layout: "/admin",
  },
  {
    path: "/orders",
    name: Translation["Orders"],
    icon: "ni ni-collection text-purple",
    component: Orders,
    layout: "/admin",
  },
  {
    path: "/restaurants",
    name: Translation["Restaurants"],
    icon: "ni ni-shop text-green",
    component: Restaurant,
    layout: "/admin",
  },
  {
    path: "/company",
    name: Translation["Companies"],
    icon: "ni ni-briefcase-24 text-blue",
    component: Companies,
    layout: "/admin",
  },
  {
    path: "/package",
    name: Translation["Packages"],
    icon: "ni ni-bag-17 text-pink",
    component: Packages,
    layout: "/admin",
  },
  {
    path: "/blocks",
    name: Translation["Blocks"],
    icon: " ni ni-app text-red",
    component: Blocks,
    layout: "/admin",
  },
  {
    path: "/delivery-person",
    name: Translation["Delivery Person"],
    icon: "ni ni-delivery-fast text-red",
    component: DeliveryPerson,
    layout: "/admin",
  },
  {
    path: "/discounts",
    name: Translation["Discounts"],
    icon: "fas fa-hand-holding-usd text-black",
    component: Discounts,
    layout: "/admin",
  },

  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },

  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin"
  // },
  {
    path: "/login",
    name: Translation["Login"],
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Register,
  //   layout: "/auth"
  // }
];
export default routes;
