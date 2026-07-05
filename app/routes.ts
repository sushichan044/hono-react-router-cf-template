import type { RouteConfig } from "@react-router/dev/routes";
import { layout, index } from "@react-router/dev/routes";

export default [
  layout("./routes/_layout.tsx", [index("./routes/_index.tsx")]),
] satisfies RouteConfig;
