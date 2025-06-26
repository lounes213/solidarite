import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("offres/:id", "routes/offres.$id.tsx")
] satisfies RouteConfig;
