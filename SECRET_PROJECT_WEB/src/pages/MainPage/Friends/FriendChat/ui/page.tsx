import { useParams } from "react-router";
import styles from "./styles.module.scss";
import { MessageBlock } from "../MessageBlock/MessageBlock";
import { FriendChatHeader } from "../FriendChatHeader/FriendChatHeader";
import { useEffect, useState } from "react";
import { FriendChatAudioAndVideoBlock } from "../FriendChatAudioAndVideoBlock/FriendChatAudioAndVideoBlock";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import { useCreateUserRoom } from "@/shared/hooks/message/room/useCreateUserRoom";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDeleteUserRoom } from "@/shared/hooks/message/room/useDeleteUserRoom";
import { useJoinUserRoom } from "@/shared/hooks/message/room/useJoinUserRoom";
import { useGetUserRoomInformation } from "@/shared/hooks/message/room/useGetUserRoomInformation";

export const FriendChat = () => {
  const { friendId } = useParams();

  const [isAudioAndVideoBlockOpen, setIsAudioAndVideoBlockOpen] =
    useState(false);

  const [roomId, setRoomId] = useState<string | null>(null);

  const {
    userRoomInformation,
    isGetUserRoomInformationSuccess,
    refetchGetUserRoomInformation,
  } = useGetUserRoomInformation({
    leftUserId: localStorageService.getUserId() ?? "",
    rightUserId: friendId ?? "",
  });

  useEffect(() => {
    if (userRoomInformation) {
      setRoomId(userRoomInformation.id);
    }
  }, [isGetUserRoomInformationSuccess]);

  const { createUserRoomAsync } = useCreateUserRoom();
  const { deleteUserRoomAsync } = useDeleteUserRoom();
  const { joinUserRoomAsync } = useJoinUserRoom();

  useEffect(() => {
    messageSignalRServiceInstance.onReceiveRoomCreated((room) => {
      console.log("room", room);
      refetchGetUserRoomInformation();
    });

    messageSignalRServiceInstance.onReceiveRoomDeleted((roomId) => {
      console.log("roomId", roomId);
      setRoomId(null);
    });

    return () => {
      messageSignalRServiceInstance.stopOnReceiveRoomCreated();
      messageSignalRServiceInstance.stopOnReceiveRoomDeleted();
    };
  }, []);

  const handleConnectToCall = async () => {
    const room = await joinUserRoomAsync({
      roomId: roomId ?? "",
      userId: localStorageService.getUserId() ?? "",
    });
    setRoomId(room.id);
    setIsAudioAndVideoBlockOpen(true);
  };

  const handleCreateCall = async (type: "audio" | "video") => {
    console.dir(type);
    const roomId = await createUserRoomAsync({
      fromUserId: localStorageService.getUserId() ?? "",
      toUserId: friendId ?? "",
    });
    setRoomId(roomId);
    setIsAudioAndVideoBlockOpen(true);
  };

  const handleDisconnectFromCall = async () => {
    if (roomId) {
      await deleteUserRoomAsync({ roomId });
      setRoomId(null);
      setIsAudioAndVideoBlockOpen(false);
    }
  };
  return (
    <div className={styles["friend-chat"]}>
      {isAudioAndVideoBlockOpen ? (
        <FriendChatAudioAndVideoBlock
          handleDisconnect={handleDisconnectFromCall}
          roomId={roomId}
        />
      ) : (
        <FriendChatHeader
          friendId={friendId ?? ""}
          openAudioAndVideoBlock={handleCreateCall}
          roomId={roomId}
          connectToCall={handleConnectToCall}
        />
      )}
      <MessageBlock friendId={friendId ?? ""} />
    </div>
  );
};
