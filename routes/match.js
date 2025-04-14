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
    if (!req.file) {
      return res.status(400).json({ error: "파일이 필요합니다" });
    }
    const filePath = req.file.path;
    console.log("Uploaded file path:", filePath);

    const parsed = await processRoflFile(filePath);

    fs.unlinkSync(filePath);

    res.status(201).json({ message: "업로드 성공", match: parsed });
  } catch (err) {
    console.error("업로드 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
