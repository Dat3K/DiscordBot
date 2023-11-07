const { google } = require('googleapis');
const moment = require('moment-timezone');
moment.locale('vi');
const keys = require('../culi-398907-4d795ad4df93.json');
require('dotenv').config();
const vietnamTime = moment()
  .tz('Asia/Ho_Chi_Minh')
  .format('HH:mm DD/MM/YYYY');

// Khởi tạo client OAuth2
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

// Khởi tạo Sheets API
const sheets = google.sheets({ version: 'v4', auth: client });

// Lấy dữ liệu từ Google Sheets
const getDataSheet = async (rangeSheet) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: rangeSheet, // Range của sheet bạn muốn truy cập
    });
    return response.data.values;
  } catch (error) {
    console.error(error);
  }
};


const updateDataSheet = async (rangeSheet, data) => {
  try {
    sheets.spreadsheets.values.update(
      {
        spreadsheetId: process.env.SHEET_ID,
        range: rangeSheet,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: data,
        },
      },
      (err, res) => {
        if (err) {
          console.error('Lỗi khi ghi dữ liệu vào Google Sheets:', err);
          return;
        }
        console.log(`Dữ liệu đã được update ${vietnamTime}`);
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const appendDataSheet = async (
  rangeSheet,
  data,
  sheetID = process.env.SHEET_ID
) => {
  try {
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: sheetID,
        range: rangeSheet,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: data,
        },
      },
      (err, res) => {
        if (err) {
          console.error('Lỗi khi ghi dữ liệu vào Google Sheets:', err);
          return;
        }
        console.log(`Dữ liệu đã ghi vào lúc ${vietnamTime}`);
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const getHousework = async () => {
  try {
    const data = await getDataSheet('PhongDocKinh!A2:H20');
    const today = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
    const tomorrow = moment()
      .add(1, 'days')
      .tz('Asia/Ho_Chi_Minh')
      .format('DD/MM/YYYY');
    const housework = data.filter((row) => {
      return row.find(
        (cell) => cell.includes(today) || cell.includes(tomorrow)
      );
    });
    if (housework.length === 0) console.log('Không thấy người trực phòng');
    return {
      today: [housework[0][0], housework[0][1]],
      tomorrow: [housework[1][0], housework[1][1]],
      time: moment().tz('Asia/Ho_Chi_Minh'),
    };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getDataSheet,
  updateDataSheet,
  appendDataSheet,
  getHousework,
};
