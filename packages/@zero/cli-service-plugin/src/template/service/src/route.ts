/**
 * DO NOT MOVE THIS FILE ELSEWHERE
 */

import { route } from "zero";

export default route({
  routes: [
    {
      path: "/",
      redirect: "/prev",
    },
    {
      name: "Prev",
      path: "/prev",
      component: "@/pages/prev",
    },
    {
      name: "Next",
      path: "/next",
      component: "@/pages/next",
    },
  ],
});
