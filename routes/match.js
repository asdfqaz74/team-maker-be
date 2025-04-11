const express = require("express");
const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");
const Match = require("../models/Match");
const { processRoflFile } = require("../utils/processRoflFile");

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const parsed = await processRoflFile(filePath);

    const newMatch = await Match.create({
      players: parsed.players,
      maxDamage: parsed.maxDamage,
      uploadedBy: null,
    });

    fs.unlinkSync(filePath);

    res.status(201).json({ message: "업로드 성공", match: newMatch });
  } catch (err) {
    console.error("업로드 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
