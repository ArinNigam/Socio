import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { getOTPOptions,getRegistrationOptions } from "../config/emailTransporter.js";
import transporter  from '../config/emailTransporter.js';

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(); 
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: passwordHash,
      otp: null,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { password, email, profilePhoto } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Incorrect Password" });

    const { id } = req.params;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
        password: passwordHash,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser)
      return res
        .status(400)
        .json({ msg: "User is not updated! " });

    const posts = await Post.find({});

    posts.forEach(async (value, index) => {
      let newComments = [];
      for (let comment of value.comments) {
        if (comment.userId === id) {
          newComments.push({
            ...comment,
            image: profilePhoto,
          });
        } else newComments.push(comment);

        value.comments = newComments;
      }

      const newId = new mongoose.Types.ObjectId();
      let userProfilePhoto = value.userProfilePhoto;
      if (value.userId === id) userProfilePhoto = profilePhoto;
      const post = {
        firstName: value.firstName,
        lastName: value.lastName,
        _id: newId,
        userId: value.userId,
        likes: value.likes,
        comments: value.comments,
        location: value.location,
        description: value.description,
        postImage: value.postImage,
        userProfilePhoto: userProfilePhoto,
      };
      await Post.findByIdAndDelete({ _id: value.id });
      const newPost = new Post(post);
      await newPost.save();
    });

    const updatedPosts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json({ updatedUser, updatedPosts });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const sendRegistrationMail = async (req, res) => {
  try {
    const { name, email } = req.body;
    let otp = Math.floor(Math.random() * 10000);
    if (otp < 1000 || otp > 9999) otp = 6969;
    console.log(otp);

    const mailOptions = getRegistrationOptions(email, otp);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: `Failed to send OTP to ${email}` });
      } else {
        console.log("Message sent: %s", info.response);
        return res.json({ message: "OTP sent sucessfully" + " to " + email });
      }
    });

   
    res.status(200).json(otp);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const sendMail = async (req, res) => {
  try {
    const { name, email } = req.body;
    const otp = Math.floor(Math.random() * 10000);
    if (otp < 1000 || otp > 9999) otp = 6969;

    let user = await User.findOne({ email: email });
    user.otp = otp;

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        ...user,
      },
      { new: true, runValidators: true }
    );
    
     const mailOptions = getOTPOptions(email, otp);
     
     transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
        console.log(error);
        return res.status(400).json({ message: `Failed to send OTP to ${email}` });
       } 
       else {
        console.log("Message sent: %s", info.response);
        return res.json({ message: "OTP sent sucessfully" + " to " + email });
       }
     });
    
    
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error sending email: ${error}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { enteredOtp, email } = req.body;
    const user = await User.find({ email: email });

    if (String(user[0].otp) === String(enteredOtp))
      res.status(200).json(true);
    else res.status(200).json(false);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    let user = await User.findOne({ email: email });
    user.password = passwordHash;

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        ...user,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};