// pages/login.tsx
import { useState } from "react";
import {  Button, Paper, TextField, Typography } from "@mui/material";
import { supabase } from "@/lib/Supabase";
import { useRouter } from "next/router";
// import  showCustomToast  from "../toast/customToast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        // showCustomToast(error.message)
      console.error("Login error:", error.message);
    } else {
      // If login is successful, check the user's role
      const userRole = data.user?.user_metadata?.role;
      // showCustomToast("Welcome Back!")
      console.log(userRole,data)
      if (userRole === "agent") {
        router.push("/agent-dashboard"); // Redirect to Agent Dashboard
      } else if (userRole === "user") {
        router.push("/user-dashboard"); // Redirect to User Dashboard
      } else {
        console.error("No role found for user");
      }
    }
  };

  return (
    <div className="login-page">
    <Paper elevation={6} className="login-box">
      <Typography variant="h3" className="login-title">
        💌 BaatCheet 💬
      </Typography>

      <Typography variant="body1" className="login-subtext">
        A safe space to talk anonymously. <br />
        Speak your heart — no names, no pressure 💖
      </Typography>

      <div className="login-form">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          className="login-button"
        >
          Log In
        </Button>
      </div>

      <Typography variant="caption" className="login-note">
        No judgments. Just feelings. Let it out 🫶
      </Typography>
    </Paper>
  </div>
  );
};

export default Login;
