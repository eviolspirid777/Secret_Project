import { AutorizationPage } from "@/pages/AutorizePage/ui";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@/pages/MainPage/ui";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ProtectedRoute />,
      },
      {
        path: "autorize",
        element: <AutorizationPage />,
      },
      {
        element: <ProtectedRoute />, // защищённая область
        children: [
          {
            path: "main-content",
            element: <MainPage />,
          },
          // другие защищённые маршруты...
        ],
      },
    ],
  },
]);

export const RouterProviderContext = () => {
  return <RouterProvider router={router} />;
};
