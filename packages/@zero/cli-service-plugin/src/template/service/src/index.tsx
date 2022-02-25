import React from "react";
import { run } from "zero";

import { Layout } from "./layout";

import route from "@/route";

export default run({
  layout: (props) => <Layout {...props} />,
  route,
});
