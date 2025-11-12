import { createBrowserRouter } from "react-router";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/Signup";
import Auth from "../layouts/Auth";
import Dashboard from "../components/dashboard/Dasboard";
import Payment from "../pages/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
        {
            index: true,
            Component: Home,
        },
        {
          path: '/auth',
          Component: Auth,
          children: [
            {
              path: 'login',
              Component: Login
            },
            {
              path: 'sign-up',
              Component: SignUp
            }
          ]
        },
        {
          path: '/dashboard',
          Component: Dashboard
        },
        {
          path: '/pricing',
          Component: Payment,
        }
    ]
  },
]);