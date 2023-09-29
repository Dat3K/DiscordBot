// const { EmbedBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();
rule.tz = "Asia/Ho_Chi_Minh";
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 19;
rule.minute = 0;

module.exports = (channel) =>
  schedule.scheduleJob(rule, () => {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0xffe608)
      .setTitle("Đăng kí cơm")
      .setAuthor({
        name: "MOMMY",
        iconURL: "https://media.giphy.com/media/wRmOK4J2261gI/giphy.gif",
      })
      .setDescription("Thả reaction bên dưới để đăng kí cơm")
      .setThumbnail("https://media.giphy.com/media/b5Hcaz7EPz26I/giphy.gif")
      .addFields(
        { name: "\u200B", value: "Thả ⛅ để đăng kí cơm sáng" },
        { name: "\u200B", value: "Thả 🌃 để đăng kí cơm chiều" },
        { name: "\u200B", value: "\u200B" },
      )
      .setImage(null)
      .setTimestamp()
      .setFooter({
        text: "DangKiCom",
        iconURL: "https://media.giphy.com/media/TDKHyccYrT2SZKjQ5V/giphy.gif",
      });
    channel.send({ embeds: [exampleEmbed] });
  });
