const express = require("express");
const router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Contact = require("../models/contact");
const TYPE = "contacts";

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find().populate("group");
    res.json(contacts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, phone, imageUrl, group } = req.body;
    const { id } = req.params;
    const contact = await Contact.findOne({ id });
    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    contact.imageUrl = imageUrl;
    contact.group = group;
    console.log("contact", contact);
    Contact.updateOne({ id }, contact);
    res.json({ message: "worked" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", (req, res, next) => {
  try {
    const id = sequenceGenerator.nextId(TYPE);
    const { name, email, phone, imageUrl, group } = req.body;
    const contact = new Contact({ id, name, email, phone, imageUrl, group });
    console.log("contact", contact);
    contact.save();
    res.status(201).json({
      message: "contact added successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contact.deleteOne({ id });
    res.status(201).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
});
module.exports = router;
