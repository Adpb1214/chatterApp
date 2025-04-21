// pages/index.tsx
"use client";

import { Box, Typography, Button, Stack, Container, Paper } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        // background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, textAlign: "center", bgcolor: "#fff0f5" }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#d81b60"
            gutterBottom
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            BaatCheet <ChatBubbleOutlineIcon sx={{ fontSize: 40, ml: 1 }} />
          </Typography>

          <Typography variant="body1" fontSize="1.1rem" mb={3} color="text.secondary">
            Unload your sorrows 😔, share your happiness 😄, or just say hi 👋.<br />
            <strong>You talk, we listen — no judgment, no identity needed.</strong>
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" mb={4}>
            Just vibes. Just you. Just BaatCheet 💬 <FavoriteIcon fontSize="small" color="error" />
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push("/login")}
              sx={{ px: 4, py: 1 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/register")}
              sx={{ px: 4, py: 1 }}
            >
              Register
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
