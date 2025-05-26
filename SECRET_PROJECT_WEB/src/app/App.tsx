import { RouterProviderContext } from "@/shared/router/router";
import { Suspense } from "react";
import { Loader } from "@/shared/components/Loader/loader";

export const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProviderContext />
    </Suspense>
  );
};
