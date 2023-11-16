const { EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');
const Weather = require('../modules/Weather');
moment.locale('vi');

module.exports = async () => {
  try {
    const weather = new Weather();
    await weather.run();
    const name = 'Fujiwara Chika';
    const avatar =
      'https://i.pinimg.com/originals/a7/a0/0b/a7a00ba09db6aaf0817b83298c0fe6f4.jpg';
    const now = moment().format('dddd DD/MM');
    const weatherToday = weather.getDayDetail();
    let uvInfo = '';
    if (weatherToday.uv > 0 && weatherToday.uv <= 2) {
      uvInfo = 'Thấp, không cần bảo vệ đặc biệt.';
    } else if (weatherToday.uv > 2 && weatherToday.uv <= 5) {
      uvInfo = 'Trung bình, nên đeo kính râm khi ra ngoài.';
    } else if (weatherToday.uv > 5 && weatherToday.uv <= 7) {
      uvInfo =
        'Cao, cần bảo vệ bằng kem chống nắng, mắt kính, đội nón và tránh ánh nắng trực tiếp';
    } else if (weatherToday.uv > 7 && weatherToday.uv <= 10) {
      uvInfo =
        'Rất cao, hạn chế ra ngoài nếu không cần thiết, nên đeo kính râm, kem chống nắng, đội nón và tránh ánh nắng trực tiếp. ';
    } else if (weatherToday.uv > 10) {
      uvInfo =
        'Nguy hiểm, không nên ra ngoài vào giờ cao điểm, nên đeo kính râm, kem chống nắng, đội nón và tránh ánh nắng trực tiếp.';
    }
    const dash = '============================';

    const embed_message = new EmbedBuilder()
      .setTitle(`DỰ BÁO THỜI TIẾT TỔNG QUAN HÔM NAY ${now}`.toUpperCase())
      .setAuthor({
        name: name,
        iconURL: avatar,
      })
      .setColor(0x69ebff)
      .setThumbnail(`https:${weatherToday.condition.icon}`)
      .addFields(
        {
          name: dash,
          value: `➡️ Thời tiết hôm nay: ***${weatherToday.condition.text}***`,
        },
        {
          name: dash,
          value: `🌡️ Nhiệt độ trung bình hôm nay: ***${weatherToday.avgtemp_c}°C***`,
        },
        {
          name: dash,
          value: `🌡️ Nhiệt độ cao nhất vào khoảng: ***${weatherToday.maxtemp_c}°C***`,
        },
        {
          name: dash,
          value: `🌡️ Nhiệt độ thấp nhất vào khoảng: ***${weatherToday.mintemp_c}°C***`,
        },
        {
          name: dash,
          value: `🌧️ Xác xuất có mưa: ***${weatherToday.mintemp_c}%***`,
        },
        {
          name: dash,
          value: `🔆 UV: *${uvInfo}\n${dash}*`,
        }
      )
      .setFooter({
        text: name,
        iconURL: avatar,
      })
      .setTimestamp();

    return embed_message;
  } catch (error) {
    console.log(error);
  }
};
