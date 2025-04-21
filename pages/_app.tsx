// pages/_app.tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../styles/globals.css";
import type { AppProps } from "next/app";

const theme = createTheme({
  // Customize your theme here if needed
  palette: {
    mode: "light", // or "dark" if you prefer dark mode by default
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
