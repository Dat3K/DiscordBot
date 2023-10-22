const SheetReader = require('./sheet_reader');
const { housework_embed } = require('../embeds/reg_embeds');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
moment.locale('vi');

//==============Hàm đăng lịch trực phòng=====================
module.exports = (channel, hour, minute) => {
  try {
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Ho_Chi_Minh';
    rule.dayOfWeek = [0, new schedule.Range(0, 6)];
    rule.hour = hour;
    rule.minute = minute;
    vietnamTime = moment()
      .tz('Asia/Ho_Chi_Minh')
      .format('dddd, [ngày] DD/MM/YYYY');
    sheet_range = 'MemberID!A3:B21';

    const housework = new schedule.scheduleJob(rule, async () => {
      let pdkIDList = await SheetReader.getDataSheet(sheet_range);
      const pre_member = pdkIDList[pdkIDList.length - 1][0];
      const cur_member = `<@${pdkIDList[0][1]}>`;
      const next_member = pdkIDList[1][0];
      channel.send({
        embeds: [
          housework_embed(vietnamTime, pre_member, cur_member, next_member),
        ],
      });
      pdkIDList.push(pdkIDList.shift());
      SheetReader.updateDataSheet(sheet_range, pdkIDList);
    });
  } catch (error) {
    console.error(error);
  }
};
