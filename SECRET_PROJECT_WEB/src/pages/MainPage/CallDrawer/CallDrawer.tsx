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
import type { UserShortDto } from "@/types/User/User";
import type { FC } from "react";

import styles from "./styles.module.scss";

type CallDrawerProps = {
  isOpen: boolean;
  onOpenChange: (status: "accepted" | "rejected") => void;
  caller: UserShortDto | null;
};

export const CallDrawer: FC<CallDrawerProps> = ({
  isOpen,
  onOpenChange,
  caller,
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={() => onOpenChange("rejected")}>
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
              onClick={() => onOpenChange("accepted")}
            >
              Принять
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className={styles["call-drawer-footer-button-reject"]}
                onClick={() => onOpenChange("rejected")}
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
