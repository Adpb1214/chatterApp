"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Message } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/Supabase";
import  showCustomToast from "../toast/customToast";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    getSession();

    // Realtime auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showCustomToast("Come back soon! 👋");
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="#ff80ab"
      color="white"
      padding={2}
      borderBottom="2px solid #ff4081"
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        display="flex"
        alignItems="center"
      >
        BaatCheet
        <Message sx={{ marginLeft: 1 }} fontSize="large" />
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        {isLoggedIn ? (
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "#ff4081",
                borderColor: "white",
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "white",
              color: "#ff4081",
              "&:hover": {
                backgroundColor: "#ffeef3",
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
