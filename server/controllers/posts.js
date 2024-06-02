import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, postImage } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userProfilePhoto: user.profilePhoto,
      postImage,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const post = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const myPosts = await Post.find({ userId: id }).sort({ createdAt: -1 });
    let post = await Post.find().sort({ createdAt: -1 });

    post = post.filter((item) => {
      return user.friends.includes(item.userId);
    });

    post = [...myPosts, ...post];
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.find({ id }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, comment, userId } = req.body;

    let obj = { name: name, image: image, comment: comment, userId };

    const post = await Post.findById(id);
    post.comments.push(obj);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { index } = req.body;

    const post = await Post.findById(id);
    const comments = post.comments;

    const updatedComments = comments.filter((val, idx) => idx !== index);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: updatedComments },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete({ _id: postId });
    if (!post) res.status(404).json({ msg: `No post with id : ${postId}` });

    const updatedPosts = await Post.find();

    res.status(200).json(updatedPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

export const hideLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { update } = req.body;

    const post = await Post.findById({ _id: id });
    if (!post) res.status(404).json({ msg: `No post with id : ${id}` });

    if (update === "like") post.showLikes = !post.showLikes;
    else if (update === "comment") post.showComments = !post.showComments;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        ...post,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};