const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  userNickname: String,
  champion: String,
  team: { type: String, enum: ["Blue", "Red"] },
  position: String,
  kills: Number,
  deaths: Number,
  assists: Number,
  totalDamageDealt: Number,
  totalDamageTaken: Number,
  boughtWards: Number,
  wardsPlaced: Number,
  wardsKilled: Number,
  minionsKilled: Number,
  win: Boolean,
});

const MatchSchema = new mongoose.Schema(
  {
    players: [PlayerSchema],
    maxDamage: Number,
    uploadedBy: mongoose.Schema.Types.ObjectId, // 나중에 붙이기
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);
