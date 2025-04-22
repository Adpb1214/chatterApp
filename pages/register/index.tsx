"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { supabase } from "@/lib/Supabase";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// import showCustomToast  from "../toast/customToast";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "user"; // Default role
  const router = useRouter();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (error) {
      console.error(error.message);
    } else {
      // showCustomToast("Account created! Let's start chatting!");
      router.push("/login");
      console.log("Signup success:", data);
      // Optionally redirect to chat page
    }
  };

  return (
    <Box
      minHeight="70vh"
      // bgcolor="#ffe4ec"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#fff0f5",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: "#ff4081", mr: 1 }} />
          <Typography variant="h4" fontWeight="bold" color="#d81b60">
            BaatCheet
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          🫶 No real email needed! <br />
          Register anonymously to share your heart — unload your sorrows 😔,
          spread your joy 😊, or simply chat away 💬.<br />
          Let us be a part of your daily life. ❤️
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email (any placeholder)"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleSignup}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#ff4081",
              "&:hover": { backgroundColor: "#f50057" },
              fontWeight: "bold",
            }}
          >
            🚀 Sign Up & Start Chatting
          </Button>
          <Button
            onClick={()=>{router.push("/login")}}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#ff4081",
              "&:hover": { backgroundColor: "#f50057" },
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
