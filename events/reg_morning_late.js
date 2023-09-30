module.exports = async (message, channel) => {
  const emojiMorning = "<:morning_rice:1157531078165286983>";

  await message.react(emojiMorning);
  const collector = message.createReactionCollector({
    // time: 7 * 60 * 60 * 1000 + 15 * 60 * 1000, // Từ 4h sáng đến 11h15 => 7h15
    time: 5000,
    dispose: true, // Bao gồm cả khi người dùng bỏ react
  });
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const morningSet = new Set();

  collector.on("collect", async (reaction, user) => {
    const member = await message.guild.members.cache.get(user.id);

    if (reaction.emoji.name === "morning_rice") {
      morningSet.add(member.nickname);
    }
  });

  collector.on("remove", async (reaction, user) => {
    const member = await message.guild.members.cache.get(user.id);

    if (reaction.emoji.name === "morning_rice") {
      morningSet.delete(member.nickname);
    }
  });

  collector.on("end", async () => {
    const morningCount = morningSet.size;
    let morningArray = Array.from(morningSet);

    await channel.send(
      `**Danh sách người đăng kí trễ sáng:**\n
      *Số lượng: ${morningCount}*\n➖➖➖➖➖\n🆗\t${morningArray.join("\n🆗\t")}`
    );
  });
};
