// pages/index.tsx
import { useState } from "react";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { supabase } from "@/lib/Supabase";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

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
      console.log("Signup success:", data);
      // Optionally redirect to chat page or another page
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Welcome to Chat App</h1>
      <div className="flex flex-col gap-3 w-96">
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
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={handleSignup}
          variant="contained"
          color="primary"
          fullWidth
          className="button"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Home;
