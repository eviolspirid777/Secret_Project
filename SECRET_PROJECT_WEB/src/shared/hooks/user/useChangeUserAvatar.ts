import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { changeUserAvatar as changeUserAvatarAction } from "@/store/slices/User.slice";

export const useChangeUserAvatar = () => {
  const dispatch = useDispatch();

  const { mutate: changeUserAvatar, isPending } = useMutation({
    mutationKey: ["changeUserAvatar"],
    mutationFn: (data: FormData) => apiClient.ChangeUserAvatar(data),
    onSuccess: (data) => {
      console.log(data);
      dispatch(changeUserAvatarAction(data));
    },
  });

  return { changeUserAvatar, isPending };
};
