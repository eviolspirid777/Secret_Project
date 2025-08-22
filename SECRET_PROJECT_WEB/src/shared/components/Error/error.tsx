import { Button } from "@/shadcn/ui/button";
import type { FC } from "react";
import type { AxiosError } from "axios";

type ErrorProps = {
  error: AxiosError | null;
  resetStates: () => void;
};

export const Error: FC<ErrorProps> = ({ error, resetStates }) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {typeof error?.response?.data === "string" && (
        <p>{error?.response?.data}</p>
      )}
      <Button onClick={resetStates}>Попробовать снова</Button>
    </div>
  );
};
