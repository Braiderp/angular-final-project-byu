const express = require("express");
const router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/message");
const TYPE = "messages";

router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find().exec();
    res.json(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const id = sequenceGenerator.nextId(TYPE);
    console.log("id", id);
    const { subject, msgText, sender } = req.body;
    const message = new Message({
      id,
      subject,
      msgText,
      sender,
    });
    await message.save();
    res.status(201).json({
      message: "Message added successfully",
      document: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});
module.exports = router;
