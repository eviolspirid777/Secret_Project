import { AutorizationPage } from "@/pages/AutorizePage/ui";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@/pages/MainPage/ui";
import { ChannelContent } from "@/pages/MainPage/Channels/ChannelContent/ChannelContent";
import { MyProfile } from "@/pages/MainPage/Profile/MyProfile/MyProfile";
import { FriendChat } from "@/pages/MainPage/Friends/FriendChat/page";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <MainPage />,
            children: [
              {
                path: "channels/:channelId",
                element: <ChannelContent />,
              },
              {
                path: "my-profile",
                element: <MyProfile />,
              },
              {
                path: "friend-chat/:friendId",
                element: <FriendChat />,
              },
            ],
          },
        ],
      },
      {
        path: "autorize",
        element: <AutorizationPage />,
      },
    ],
  },
]);

export const RouterProviderContext = () => {
  return <RouterProvider router={router} />;
};
