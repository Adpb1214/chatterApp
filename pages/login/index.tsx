// pages/login.tsx
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { supabase } from "@/lib/Supabase";
import { useRouter } from "next/router";

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
      console.error("Login error:", error.message);
    } else {
      // If login is successful, check the user's role
      const userRole = data.user?.user_metadata?.role;
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
    <div className="flex flex-col gap-3 w-96 mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <TextField
        label="Email"
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
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Log In
      </Button>
    </div>
  );
};

export default Login;
