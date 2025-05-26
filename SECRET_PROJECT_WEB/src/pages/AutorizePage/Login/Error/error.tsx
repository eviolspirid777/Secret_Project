import { Button } from "@/shadcn/ui/button";
import type { FC } from "react";

type ErrorProps = {
  error: Error | null;
  resetStates: () => void;
};

export const Error: FC<ErrorProps> = ({ error, resetStates }) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {error?.message}
      <Button onClick={resetStates}>Попробовать снова</Button>
    </div>
  );
};
