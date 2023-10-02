const moment = require("moment-timezone");

module.exports = async (event, readChannel, writeChannel, reaction, user) => {
  try {
    // Kiểm tra nếu người thả react là bot thì bỏ qua
    if (user.bot || reaction.message.channel.id != readChannel) return;
    const vietnamTime = moment()
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm:ss  DD MM YYYY");
    if (reaction.message.partial) await reaction.message.fetch(); // Lấy tin nhắn nếu tin nhắn chưa được tải hoàn chỉnh
    const guild = reaction.message.guild;
    const member = guild.members.cache.get(user.id);
    // Ghi lại thông tin về thời gian và người thả react
    if (event == "messageReactionAdd") {
      await writeChannel.send(
        `${member.nickname || `<@${user.id}>`} đã thêm react <:${
          reaction.emoji.name
        }:${reaction.emoji.id || ""}> lúc ${vietnamTime}`
      );
    }
    if (event == "messageReactionRemove") {
      await writeChannel.send(
        `${member.nickname || `<@${user.id}>`} đã bỏ react <:${
          reaction.emoji.name
        }:${reaction.emoji.id || ""}> lúc ${vietnamTime}`
      );
    }
  } catch (error) {
    console.error(error);
  }
};
