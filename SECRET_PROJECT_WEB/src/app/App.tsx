import { RouterProviderContext } from "@/shared/router/router";
import { Suspense } from "react";
import { Loader } from "@/shared/components/Loader/loader";
import { Toaster } from "@/shadcn/ui/sonner";

export const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Toaster />
      <RouterProviderContext />
    </Suspense>
  );
};
