import Message from "../models/Message.js";

export const postMessage = async (req, res) => {
  try {
    const newMessage = new Message({
      ...req.body,
    });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { reciever, sender } = req.body; 

    const sendMessages = await Message.find({
      sender: sender,
      reciever: reciever,
    }).sort({ updatedAt: 1 });

    const recievedMessages = await Message.find({
      sender: reciever,
      reciever: sender,
    }).sort({ updatedAt: 1 });

    const combinedMessages = [...sendMessages, ...recievedMessages];
    combinedMessages.sort((a, b) => a.updatedAt - b.updatedAt);

    const allMessages = combinedMessages.map((msg) => {
      return {
        myself: msg.sender === sender,
        message: msg.message,
      };
    });
    console.log(allMessages);
    res.status(200).json(allMessages);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

