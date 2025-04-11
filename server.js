require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const matchRoutes = require("./routes/match");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/match", matchRoutes);

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "team-maker" })
  .then(() => {
    console.log("MongoDB 연결 성공");
    app.listen(PORT, () => {
      console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
    });
  })
  .catch((error) => {
    console.error("MongoDB 연결 실패:", error);
  });
