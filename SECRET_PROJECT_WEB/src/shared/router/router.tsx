import { AutorizationPage } from "@/pages/AutorizePage/ui";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@/pages/MainPage/ui";
import { ChannelContent } from "@/pages/MainPage/Channels/ChannelContent/ChannelContent";
import { MyProfile } from "@/pages/MainPage/Profile/MyProfile/MyProfile";
import { MyProfile as MyProfileSettings } from "@/pages/Settings/MyProfile/page";
import { FriendChat } from "@/pages/MainPage/Friends/FriendChat/page";
import { Settings } from "@/pages/Settings/ui";
import { Security } from "@/pages/Settings/Security/page";
import { AddFriend } from "@/pages/MainPage/AddFriend/ui";
import { FriendRequests } from "@/pages/MainPage/FriendRequests/ui";

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
              {
                path: "add-friend",
                element: <AddFriend />,
              },
              {
                path: "friend-requests",
                element: <FriendRequests />,
              },
            ],
          },
          {
            path: "settings",
            element: <Settings />,
            children: [
              {
                path: "profile",
                element: <MyProfileSettings />,
              },
              {
                path: "security",
                element: <Security />,
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
