const fs = require("fs");

exports.processRoflFile = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const metadataSizeBuffer = buffer.subarray(buffer.length - 4);
    const metadataSize = metadataSizeBuffer.readUInt32LE(0);

    const metadataPosition = buffer.length - metadataSize - 4;
    const rawMetadata = buffer.subarray(metadataPosition, buffer.length - 4);

    const parsedMetadata = JSON.parse(rawMetadata.toString());

    const statsJson = JSON.parse(parsedMetadata.statsJson);
    console.log("statsJson: ", statsJson.slice(0, 10));

    const positionMap = {
      TOP: "top",
      JUNGLE: "jug",
      MIDDLE: "mid",
      BOTTOM: "adc",
      UTILITY: "sup",
    };

    const filteredStats = statsJson.map((player) => ({
      userNickname: "",
      champion: player.SKIN,
      team: player.TEAM === 100 ? "Blue" : "Red",
      position: positionMap[player.TEAM_POSITION] || "Unknown",
      kills: Number(player.CHAMPIONS_KILLED),
      deaths: Number(player.NUM_DEATHS),
      assists: Number(player.ASSISTS),
      totalDamageDealt: Number(player.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS),
      totalDamageTaken: Number(player.TOTAL_DAMAGE_TAKEN),
      boughtWards: Number(player.VISION_WARDS_BOUGHT_IN_GAME),
      wardsPlaced: Number(player.WARD_PLACED),
      wardsKilled: Number(player.WARD_KILLED),
      minionsKilled: Number(player.MINIONS_KILLED),
      win: player.WIN === "Win",
    }));

    const maxDamageValue = Math.max(
      ...filteredStats.map((player) => player.totalDamageDealt)
    );
    const maxDamage = maxDamageValue + 1000;

    const sortedPosition = ["top", "jug", "mid", "adc", "sup"];
    const sortedStats = filteredStats.sort(
      (a, b) =>
        a.team.localeCompare(b.team) ||
        sortedPosition.indexOf(a.position) - sortedPosition.indexOf(b.position)
    );

    return {
      players: sortedStats,
      maxDamage,
    };
  } catch (e) {
    throw new Error("ROFL 파일 처리 오류: " + e.message);
  }
};
