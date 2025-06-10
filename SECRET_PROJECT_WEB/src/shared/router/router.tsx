import { AutorizationPage } from "@/pages/AutorizePage/ui";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@/pages/MainPage/ui";
import { lazy } from "react";

const ChannelContent = lazy(() =>
  import("@/pages/MainPage/Channels/ChannelContent/ChannelContent").then(
    (module) => ({ default: module.ChannelContent })
  )
);
const MyProfile = lazy(() =>
  import("@/pages/MainPage/Profile/MyProfile/MyProfile").then((module) => ({
    default: module.MyProfile,
  }))
);
const MyProfileSettings = lazy(() =>
  import("@/pages/Settings/MyProfile/page").then((module) => ({
    default: module.MyProfile,
  }))
);
const FriendChat = lazy(() =>
  import("@/pages/MainPage/Friends/FriendChat/ui/page").then((module) => ({
    default: module.FriendChat,
  }))
);
const Settings = lazy(() =>
  import("@/pages/Settings/ui").then((module) => ({ default: module.Settings }))
);
const Security = lazy(() =>
  import("@/pages/Settings/Security/page").then((module) => ({
    default: module.Security,
  }))
);
const AddFriend = lazy(() =>
  import("@/pages/MainPage/AddFriend/ui").then((module) => ({
    default: module.AddFriend,
  }))
);
const FriendRequests = lazy(() =>
  import("@/pages/MainPage/FriendRequests/ui").then((module) => ({
    default: module.FriendRequests,
  }))
);
const AddChannel = lazy(() =>
  import("@/pages/MainPage/AddChannel/ui").then((module) => ({
    default: module.AddChannel,
  }))
);

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
                path: "channels/add",
                element: <AddChannel />,
              },
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
