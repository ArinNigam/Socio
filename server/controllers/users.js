import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Message from "../models/Message.js";
import Post from "../models/Post.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const arrayUser = [user];
    const formattedUser = arrayUser.map(
      ({_id,firstName,lastName,email,otp}) => {
        return {_id,firstName,lastName,email,otp};
      }
    );
    res.status(200).json(formattedUser[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { email } = req.body;
    const allUsers = await User.find({});

    const singleUser = allUsers.filter((user) => user.email === email);
    let formattedUser = singleUser;
    if (singleUser) {
      formattedUser = singleUser.map(
        ({ _id, firstName, lastName}) => {return {_id,firstName,lastName};}
      );
    }
    res.status(200).json(formattedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, profilePhoto }) => {
        return { _id, firstName, lastName, occupation, location, profilePhoto };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    let allUsers = await User.find({});

    const suggestedUsers = allUsers.filter((item) => {
      return (
        user.friends.includes(item._id.toString()) === false && item._id != id
      );
    });
    const formattedSuggested = suggestedUsers.map(
      ({ _id, firstName, lastName, occupation, location, profilePhoto }) => {
        return { _id, firstName, lastName, occupation, location, profilePhoto };
      }
    );

    res.status(200).json(formattedSuggested);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, profilePhoto }) => {
        return { _id, firstName, lastName, occupation, location, profilePhoto };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateSocialProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { linkedinURL, instagramUrl } = req.body;
    const user = await User.findById(id);
    user.linkedinUrl = linkedinURL;
    user.instagramUrl = instagramUrl;
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        ...user,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await User.findById(id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(200).json("Incorrect Password!");

    await Message.deleteMany({ sender: id });
    await Message.deleteMany({ reciever: id });

    await Post.deleteMany({ userId: id });
    const allPosts = await Post.find({});
    for (let post of allPosts) {
      if (post.comments)
        post.comments = post.comments.filter((obj) => obj["userId"] !== id); // comment delete
      post.likes.delete(id);
      await post.save();
    }

    await User.findByIdAndDelete(id);
    const allUsers = await User.find({});
    for (let user of allUsers) {
      const index = user.friends.indexOf(id);
      if (index != -1) user.friends.splice(index, 1);
      await user.save();
    }

    res.status(200).json("User Deleted! " + user.email);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

