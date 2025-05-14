import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { UIProvider } from "@/context/UIContext";
import { DataProvider } from "@/context/DataContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="airdrops-hunter-theme">
      <UIProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </UIProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
