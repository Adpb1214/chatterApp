import toast from "react-hot-toast";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubbleOutline";
import { Box, Typography } from "@mui/material";

const showCustomToast = (message: string) => {
  toast.custom((t) => (
    <Box
      display="flex"
      alignItems="center"
      bgcolor="#fff0f5"
      boxShadow={3}
      borderRadius={3}
      p={2}
      color="#d81b60"
      sx={{
        border: "1px solid #ff4081",
        minWidth: 250,
        animation: t.visible ? "slideIn 0.3s" : "fadeOut 0.3s",
      }}
    >
      <ChatBubbleIcon sx={{ mr: 1 }} />
      <Typography fontWeight="bold" flex={1}>
        {message}
      </Typography>
      <FavoriteIcon sx={{ ml: 1 }} />
    </Box>
  ));
};
export default showCustomToast;