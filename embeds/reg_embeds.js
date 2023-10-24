const { EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');
moment.locale('vi');

// Chốt đăng kí cơm
const reg_rice_embed = (morningSet, nightSet, time) => {
  const morningCount = morningSet.size;
  const nightCount = nightSet.size;
  let morningList = Array.from(morningSet).join('\n🆗 ');
  let nightList = Array.from(nightSet).join('\n🆗 ');

  const embed_message = new EmbedBuilder()
    .setAuthor({
      name: 'Maid Lưu Xá 5',
      iconURL:
        'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
    })
    .setColor(0xfe0000)
    .setTitle(`Chốt đăng kí cơm ${time}`.toUpperCase())
    .setThumbnail('https://media.giphy.com/media/OZyUhzVIMeBLpjbRGn/giphy.gif')
    .addFields(
      {
        name: 'Tổng:',
        value: `Sáng: ${morningCount} \nChiều: ${nightCount}`,
      },
      {
        name: 'Sáng',
        value: `🆗 ${morningList}`,
        inline: true,
      },
      {
        name: 'Chiều',
        value: `🆗 ${nightList}`,
        inline: true,
      }
    )
    .setTimestamp()
    .setFooter({
      text: 'ChotCom',
      iconURL:
        'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
    });

  return embed_message;
};

// Chốt trễ
const reg_late_embed = (lateSet, timeline, time) => {
  const lateCount = lateSet.size;
  let lateList = Array.from(lateSet).join('\n🆗\t');
  const embed_message = new EmbedBuilder()
    .setAuthor({
      name: 'Maid Lưu Xá 5',
      iconURL:
        'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
    })
    .setColor(0x219c90)
    .setTitle(`Danh sách trễ ${timeline} ${time}`.toUpperCase())
    .setThumbnail('https://media.giphy.com/media/ES4Vcv8zWfIt2/giphy.gif')
    .addFields(
      {
        name: `*Số lượng:* **${lateCount}**`,
        value: `\n`,
      },
      {
        name: `**${timeline}:**`,
        value: `🆗\t${lateList}`,
      },
      {
        name: `\n`,
        value: `Bếp sau khi chốt trễ thì chụp lại và gửi vào đây 📸`,
      }
    )
    .setTimestamp()
    .setFooter({
      text: 'ChotTre',
      iconURL:
        'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
    });
  return embed_message;
};

const housework_embed = (time, pre_member, cur_member, next_member) => {
  const embed_message = new EmbedBuilder()
    .setAuthor({
      name: 'Maid Lưu Xá 5',
      iconURL:
        'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
    })
    .setColor(0x2efcff)
    .setTitle(`Lịch trực phòng ${time}`.toUpperCase())
    .setThumbnail('https://media.giphy.com/media/LHZyixOnHwDDy/giphy.gif')
    .addFields(
      {
        name: `\n*Hôm qua:*`,
        value: `**${pre_member}** đã trực phòng\n`,
      },
      {
        name: `\n*Hôm nay:* `,
        value: `Đến lượt ${cur_member} trực phòng\n`,
      },
      {
        name: `\n*Ngày mai:* `,
        value: `Đến lượt **${next_member}** trực phòng\n`,
      }
    )
    .setTimestamp()
    .setFooter({
      text: 'TrucPhong',
      iconURL:
        'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
    });
  return embed_message;
};

module.exports = {
  reg_rice_embed,
  reg_late_embed,
  housework_embed,
};
