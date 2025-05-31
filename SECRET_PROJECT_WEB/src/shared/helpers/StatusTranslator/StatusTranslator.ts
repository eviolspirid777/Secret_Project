import type { Status } from "@/types/Status/Status";

export const StatusTranslator = (status: Status) => {
  switch (status) {
    case "Online":
      return "Онлайн";
    case "Offline":
      return "Офлайн";
    case "NotDisturb":
      return "Занят";
    case "Sleeping":
      return "Спит";
    default:
      return "Неизвестный статус";
  }
};
