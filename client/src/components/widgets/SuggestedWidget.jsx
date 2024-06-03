import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../UI/Friend";
import WidgetWrapper from "../UI/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SuggestedWidget = ({ userId, reRender, setReRender }) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/suggested/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFriends(response.data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };
    getFriends();
  }, [token, userId, reRender]);

  return (
    <WidgetWrapper maxHeight="24rem" friend="true" marginTop="2rem">
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Suggested For You
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends &&
          friends.map((friend, index) => (
            <Friend
              key={index}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userProfilePhoto={friend.profilePhoto}
              setReRender={setReRender}
              reRender={reRender}
            />
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default SuggestedWidget;
