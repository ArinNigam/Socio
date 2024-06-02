import { useState } from "react";
import { Avatar } from "@mui/material";
import {Box,IconButton,InputBase,Typography,Select,MenuItem,FormControl,useTheme,useMediaQuery} from "@mui/material";
import { Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close  } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../store/index";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./UI/FlexBetween";
import DeleteAccountWidget from "./widgets/DeleteAccountWidget";

const NavBar = (props) => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal,setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const myself = useSelector((state) => state.user);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.default;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const fullName = `${props.user?.firstName} ${props.user?.lastName}`;
  return (
    <FlexBetween
      padding="1rem 6%"
      backgroundColor={alt}
      position="sticky"
      top="0"
      left="0"
      zIndex="99"
    >
      <FlexBetween gap="1.75rem">
        <Typography
          fontFamily="Proxima Nova , cursive, sans-serif"
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          letterSpacing="1.5px"
          sx={{
            "&:hover": {
              fontFamily: "Proxima Nova , cursive, sans-serif",
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Socio
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message
            sx={{ fontSize: "25px", cursor: "pointer" }}
            onClick={() => navigate("/chat")}
          />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} onClick={handleClickOpen} />
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Welcome to Socio"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This was a project done as a boredom of Summer of'24
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                
                width: "75px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
            }}
              input={<InputBase />}
            >
              <MenuItem
                value={fullName}
                onClick={() => navigate(`/profile/${props.user._id}`)}
              >
                <Avatar src={props.user.profilePhoto} alt={fullName} sx={{ mr: 2 }} />
              </MenuItem>
              <MenuItem onClick={() => navigate(`/update/${props.user._id}`)}>
                Update Profile
              </MenuItem>
              <MenuItem
                onClick={() => navigate(`/update/${props.user._id}/password`)}
              >
                Update Password
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              <MenuItem onClick={() => setOpenModal((prev) => !prev)}>
                
                Delete Account
              </MenuItem>
            </Select>
            {openModal && (
              <DeleteAccountWidget setOpenModal={setOpenModal} user={myself} />
            )}
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="150px"
          minWidth="100px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message
              sx={{ fontSize: "25px", cursor: "pointer" }}
              onClick={() => navigate("/chat")}
            />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} onClick={handleClickOpen} />

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{"Welcome to Socio"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This was a project done as a boredom of Summer of'24
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    
                  
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem
                  value={fullName}
                  onClick={() => navigate(`/profile/${props.user._id}`)}
                >
                  <Avatar src={props.user.profilePhoto} alt={fullName}  />
                  
                </MenuItem>
                <MenuItem onClick={() => navigate(`/update/${props.user._id}`)}>
                  Update Profile
                </MenuItem>
                <MenuItem
                  onClick={() => navigate(`/update/${props.user._id}/password`)}
                >
                  Update Password
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Delete Account
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default NavBar;
