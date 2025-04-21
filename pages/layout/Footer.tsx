import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f48fb1"
      color="white"
      padding={2}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
    >
           <Typography variant="body2">
          Anonymously Connect 💬
        </Typography>
      <Typography variant="body2">
        Made with ❤️ at Kolkata
      </Typography>
    </Box>
  );
};

export default Footer;
