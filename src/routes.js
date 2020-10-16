import Index from "views/Index.js";
import Users from "views/examples/Users.js";
import Companies from "views/examples/Companies";
import Packages from "views/examples/Packages";
import Blocks from "views/examples/Blocks";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "Users",
    icon: "ni ni-single-02 text-yellow",
    component: Users,
    layout: "/admin"
  },
  {
    path: "/company",
    name: "Companies",
    icon: "ni ni-briefcase-24 text-blue",
    component: Companies,
    layout: "/admin"
  },
  {
    path: "/package",
    name: "Packages",
    icon: "ni ni-bag-17 text-pink",
    component: Packages,
    layout: "/admin"
  },
  {
    path: "/blocks",
    name: "Blocks",
    icon: " ni ni-app text-red",
    component: Blocks,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin"
  },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin"
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
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
