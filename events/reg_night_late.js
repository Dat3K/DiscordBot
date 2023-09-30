const moment = require("moment-timezone");
const vietnamTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");

module.exports = async (message, channel) => {
  const emojiAfternoon = "<:night_rice:1157531072763015248>";

  await message.react(emojiAfternoon);
  const collector = message.createReactionCollector({
    time: 7 * 60 * 60 * 1000, // Từ 11h15h đến 18h15 =>
    dispose: true, // Bao gồm cả khi người dùng bỏ react
  });
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const afternoonSet = new Set();

  collector.on("collect", async (reaction, user) => {
    const member = await message.guild.members.cache.get(user.id);

    if (reaction.emoji.name === "night_rice") {
      afternoonSet.add(member.nickname);
    }
  });

  collector.on("remove", async (reaction, user) => {
    const member = await message.guild.members.cache.get(user.id);

    if (reaction.emoji.name === "night_rice") {
      afternoonSet.delete(member.nickname);
    }
  });

  collector.on("end", async () => {
    const afternoonCount = afternoonSet.size;
    let afternoonArray = Array.from(afternoonSet);

    await channel.send(
      `**Danh sách người đăng kí trễ tối ngày ${vietnamTime}:**
      *Số lượng: ${afternoonCount}*\n➖➖➖➖➖\n🆗\t${afternoonArray.join(
        "\n🆗\t"
      )}`
    );
  });
};
