import { Button } from "@/shadcn/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shadcn/ui/drawer";
import { Avatar } from "@/shared/components/Avatar/Avatar";
import { useIncommingCallResearch } from "@/shared/hooks/incommingCallResearch/useIncommingCallResearch";
import { useState } from "react";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

export const CallDrawer = () => {
  const navigate = useNavigate();

  const [isCallDrawerOpen, setIsCallDrawerOpen] = useState(false);

  const { caller, stopIncommingCallSound } =
    useIncommingCallResearch(setIsCallDrawerOpen);

  const handleCloseCallDrawer = (status: "accepted" | "rejected") => {
    stopIncommingCallSound();
    switch (status) {
      case "accepted":
        navigate(`/friend-chat/${caller?.id}/acceptCall`);
        break;
      case "rejected":
        console.log("REJECTED");
        break;
    }
    setIsCallDrawerOpen(false);
  };

  return (
    <Drawer
      open={isCallDrawerOpen}
      onOpenChange={() => handleCloseCallDrawer("rejected")}
    >
      <DrawerContent className={styles["call-drawer"]}>
        <div className={styles["call-drawer-container"]}>
          <DrawerHeader>
            <DrawerTitle className={styles["call-drawer-title"]}>
              Входящий вызов
            </DrawerTitle>
            <DrawerDescription className={styles["call-drawer-description"]}>
              Вызов от {caller?.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Avatar
                src={caller?.avatar}
                className={styles["call-drawer-avatar"]}
                size="large"
              />
            </div>
          </div>
          <DrawerFooter className={styles["call-drawer-footer"]}>
            <Button
              className={styles["call-drawer-footer-button"]}
              onClick={() => handleCloseCallDrawer("accepted")}
            >
              Принять
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className={styles["call-drawer-footer-button-reject"]}
                onClick={() => handleCloseCallDrawer("rejected")}
              >
                Отклонить
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
