import { AutorizationPage } from "@/pages/AutorizePage/ui";
import { ErrorPage } from "@/pages/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@/pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AutorizationPage />,
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
