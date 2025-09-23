import { useAuthStore } from "~~/stores/Auth";

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server-side
  if (process.server) return;

  const auth = useAuthStore();

  // make sure auth store is hydrated on client
  if (!auth.token) {
    auth.loadAuthFromStorage();
  }

  // Use the token from the store
  const token = auth.token;

  const publicRoutes = ["/login", "/signup"];
  const isPublic = publicRoutes.includes(to.path);

  // if not logged in and trying to access protected route
  if (!token && !isPublic) {
    return navigateTo("/login");
  }

  // if already logged in and trying to access login/register
  if (token && isPublic) {
    return navigateTo("/");
  }
});
