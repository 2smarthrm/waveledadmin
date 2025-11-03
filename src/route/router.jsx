import { createBrowserRouter, redirect } from "react-router-dom";
import axios from "axios";

import RootLayout from "../layout/root";
import Home from "../pages/home";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";

const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";

 
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },  
});

 
async function checkAuth() {
  try { 
    const res = await api.get("/api/auth/status", { 
      params: { _ts: Date.now() },
    });
    return !!res?.data?.data?.authenticated;
  } catch {
    return false;
  }
}

 
async function requireAuthLoader({ request }) {
  const authenticated = await checkAuth();
  if (authenticated) return null;

  const url = new URL(request.url);
  const backTo = url.pathname + url.search;
  throw redirect(
    `/authentication/login?r=${encodeURIComponent(backTo || "/")}`
  );
}

 
async function notFoundLoader() {
  const authenticated = await checkAuth();
  if (authenticated) {
    throw redirect("/");
  } else {
    throw redirect("/authentication/login");
  }
}
 
export const router = createBrowserRouter([ 
  {
    path: "/",
    element: <RootLayout />,
    loader: requireAuthLoader,
    children: [
      { index: true, element: <Home /> }, 
    ],
  },

  // ÁREA PÚBLICA (AUTH)
  {
    path: "/authentication",
    element: <LayoutAuth />,
    children: [ 
      { index: true, element: <LoginMinimal /> },
      { path: "login", element: <LoginMinimal /> },
    ],
  },
 
  {
    path: "*",
    loader: notFoundLoader,
  },
]);
 