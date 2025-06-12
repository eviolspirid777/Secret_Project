import { useParams } from "react-router";
import styles from "./styles.module.scss";
import { MessageBlock } from "../MessageBlock/MessageBlock";
import { FriendChatHeader } from "../FriendChatHeader/FriendChatHeader";
import { useCallback, useEffect, useState } from "react";
import { FriendChatAudioAndVideoBlock } from "../FriendChatAudioAndVideoBlock/FriendChatAudioAndVideoBlock";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import { useCreateUserRoom } from "@/shared/hooks/message/room/useCreateUserRoom";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDeleteUserRoom } from "@/shared/hooks/message/room/useDeleteUserRoom";
import { useJoinUserRoom } from "@/shared/hooks/message/room/useJoinUserRoom";
import { useGetUserRoomInformation } from "@/shared/hooks/message/room/useGetUserRoomInformation";
import { useConnectionAlert } from "@/shared/hooks/connectionAlert/useConnectionAlert";
import { useDisconnectionAlert } from "@/shared/hooks/connectionAlert/useDisconnectionAlert";

export const FriendChat = () => {
  const { friendId, acceptCall } = useParams();

  const [isAudioAndVideoBlockOpen, setIsAudioAndVideoBlockOpen] = useState<
    boolean | null
  >(null);

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
  }, [isGetUserRoomInformationSuccess, userRoomInformation]);

  const { createUserRoomAsync } = useCreateUserRoom();
  const { deleteUserRoomAsync } = useDeleteUserRoom();
  const { joinUserRoomAsync } = useJoinUserRoom();

  const { playConnectionSound } = useConnectionAlert();
  const { playDisconnectionSound } = useDisconnectionAlert();

  useEffect(() => {
    if (isAudioAndVideoBlockOpen === true) {
      playConnectionSound();
    } else if (isAudioAndVideoBlockOpen === false) {
      playDisconnectionSound();
    }
  }, [isAudioAndVideoBlockOpen]);

  useEffect(() => {
    messageSignalRServiceInstance.onReceiveRoomCreated(() => {
      refetchGetUserRoomInformation();
    });

    messageSignalRServiceInstance.onReceiveRoomDeleted(() => {
      setRoomId(null);
      setIsAudioAndVideoBlockOpen(false);
    });

    return () => {
      messageSignalRServiceInstance.stopOnReceiveRoomCreated();
      messageSignalRServiceInstance.stopOnReceiveRoomDeleted();
    };
  }, []);

  const handleConnectToCall = useCallback(async () => {
    const room = await joinUserRoomAsync({
      roomId: roomId ?? "",
      userId: localStorageService.getUserId() ?? "",
    });
    setRoomId(room.id);
    setIsAudioAndVideoBlockOpen(true);
  }, [joinUserRoomAsync, roomId]);

  useEffect(() => {
    if (acceptCall && isGetUserRoomInformationSuccess && userRoomInformation) {
      handleConnectToCall();
    }
  }, [
    acceptCall,
    isGetUserRoomInformationSuccess,
    userRoomInformation,
    handleConnectToCall,
  ]);

  const handleCreateCall = async (type: "audio" | "video") => {
    console.dir(type);
    await createUserRoomAsync({
      fromUserId: localStorageService.getUserId() ?? "",
      toUserId: friendId ?? "",
    });
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
