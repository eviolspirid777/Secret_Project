import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import "./styles.scss";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/queryClient/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
