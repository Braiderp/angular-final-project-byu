const express = require("express");
const router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Document = require("../models/document");
const TYPE = "documents";

router.get("/", async (req, res, next) => {
  try {
    console.log("documents hit");
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ id }).exec();
    console.log("req.body", req.body);
    console.log("document", document);
    const { name, url, description } = req.body;
    document.name = name;
    document.url = url;
    document.description = description;
    await Document.updateOne({ id: id }, document);
    res.json({ message: "worked" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const maxId = sequenceGenerator.nextId(TYPE);
    const document = new Document({
      id: maxId,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
    });
    await document.save();
    res.status(201).json({
      message: "Document added successfully",
      document,
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
    console.log("delete", id);
    await Document.deleteOne({ id }).exec();
    res.status(201).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});
module.exports = router;
