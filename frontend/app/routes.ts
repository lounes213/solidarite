import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("offres/:id", "routes/offres.$id.tsx"),
  route("login", "pages/Login.tsx"),
  route("register", "pages/Register.tsx"),
  route("espace-famille", "pages/EspaceFamille.tsx"),
  route("espace-etudiant", "pages/EspaceEtudiant.tsx")
] satisfies RouteConfig;
