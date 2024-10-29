import { ThemeProvider } from "../hooks/useTheme";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
