import { useEffect, useRef } from "react";
import { useMessageAlert } from "./useMessageAlert";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import { addMessage, deleteMessage } from "@/store/slices/Message.slice";
import { useDispatch, useSelector } from "react-redux";
import { addUnreadedMessagesUserId } from "@/store/slices/UnreadedMessagesUsersId.slice";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { getSelectedChatId } from "@/store/slices/SelectedChatId.slice";
import type { RootState } from "@/store/store";

export const useMessageDisplay = () => {
  const dispatch = useDispatch();

  const { playNotificationSound } = useMessageAlert();

  const messageSignalRService = useRef(messageSignalRServiceInstance);

  const selectedChatId = useSelector((state: RootState) =>
    getSelectedChatId(state)
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let interval2: ReturnType<typeof setInterval>;
    let provideAlerting = false;

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        provideAlerting = true;
      }
      if (document.visibilityState === "visible") {
        if (interval) clearInterval(interval);
        if (interval2) clearInterval(interval2);
        document.title = "Chat";
        provideAlerting = false;
      }
    });

    Notification.requestPermission().then((permission) => {
      console.log("Permission status:", permission);
    });

    messageSignalRService.current.onDeleteMessage((message) => {
      dispatch(
        deleteMessage({
          id: message.id,
          senderId: message.senderId,
        })
      );
    });

    messageSignalRService.current.onReceiveMessage((message) => {
      const ifChatIsNotSelected =
        message.senderId !== localStorageService.getUserId() &&
        message.senderId !== selectedChatId;

      if (ifChatIsNotSelected) {
        dispatch(addUnreadedMessagesUserId(message.senderId));
      }
      dispatch(addMessage(message));

      if (Notification.permission === "granted" && provideAlerting) {
        new Notification("Новое сообщение", {
          body: message.content ?? message.file?.fileName ?? "",
          silent: true,
          lang: "ru",
          icon: "/vite.svg",
        });
      }

      playNotificationSound();

      if (document.visibilityState === "hidden") {
        document.title = "Пришло новое сообщение";
        interval = setInterval(() => {
          document.title = "Пришло новое сообщение";
        }, 2500);
        interval2 = setInterval(() => {
          document.title = "Chat";
        }, 4000);
      }
    });

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
      messageSignalRService.current.stopOnReceiveMessage();
      messageSignalRService.current.stopOnDeleteMessage();
    };
  }, [dispatch, playNotificationSound, selectedChatId]);
};
