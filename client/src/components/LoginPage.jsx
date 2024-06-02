import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {

  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box sx={{ pt: "1.5rem" }} bgcolor={theme.palette.dark} height={"100%"}>
      <Box
        width={isNonMobileScreens ? "30%" : "40%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.2rem"
        backgroundColor={theme.palette.grey[900]}
        boxShadow={theme.shadows[5]}
        sx={{ pt: "1.5rem" ,pb: "2rem" }}
      >
        <Typography
          fontFamily="Proxima Nova , cursive, sans-serif"
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          align="center"
          letterSpacing="1.5px"
          sx={{ mb: "1.5rem" }}
        >
          Socio
        </Typography>
        <Typography
          color= {theme.palette.common.white}
          fontWeight="500"
          variant="h5"
          align="center"
          sx={{ mb: "1rem" }}
        >
          Hi, Welcome Back!
        </Typography>
        <Typography
          color={theme.palette.common.white}
          fontWeight="500"
          variant="h5"
          align="center"
          sx={{ mb: "1.5rem" }}
        >
          Enter your credentials to continue
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
