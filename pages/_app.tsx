// pages/_app.tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../styles/globals.css";
import type { AppProps } from "next/app";
// import Header from "./layout/Header";
import { Container, CssBaseline } from "@mui/material";
import Footer from "./layout/Footer";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  // Customize your theme here if needed
  palette: {
    mode: "light", // or "dark" if you prefer dark mode by default
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
       <CssBaseline />


{/* <Header /> */}


<Container
  maxWidth="lg"
  sx={{
    paddingTop: "20px",
    paddingBottom: "60px", 
  }}
>
<Toaster position="top-right" reverseOrder={false} />
  <Component {...pageProps} />
</Container>


<Footer />
    </ThemeProvider>
  );
}

export default MyApp;
