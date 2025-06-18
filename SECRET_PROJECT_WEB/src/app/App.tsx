import { RouterProviderContext } from "@/shared/router/router";
import { Suspense } from "react";
import { Loader } from "@/shared/components/Loader/loader";
import { Toaster } from "@/shadcn/ui/sonner";
import "dayjs/locale/ru";

import dayjs from "dayjs";
dayjs.locale("ru");

export const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Toaster />
      <RouterProviderContext />
    </Suspense>
  );
};
