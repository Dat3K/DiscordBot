const { google } = require("googleapis");
const keys = require("../culi-398907-4d795ad4df93.json");
require("dotenv").config();

// Khởi tạo client OAuth2
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

// Khởi tạo Sheets API
const sheets = google.sheets({ version: "v4", auth: client });

// Lấy dữ liệu từ Google Sheets
const getDataSheet = async (rangeSheet) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: rangeSheet, // Range của sheet bạn muốn truy cập
  });
  return response.data.values;
};

const updateDataSheet = async (rangeSheet, data) => {
  sheets.spreadsheets.values.update(
    {
      spreadsheetId: process.env.SHEET_ID,
      range: rangeSheet,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: data,
      },
    },
    (err, res) => {
      if (err) {
        console.error("Lỗi khi ghi dữ liệu vào Google Sheets:", err);
        return;
      }
      console.log(`Dữ liệu đã được update ${new Date().getHours()}h `);
    }
  );
};

const appendDataSheet = async (rangeSheet, data) => {
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: process.env.SHEET_ID,
      range: rangeSheet,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: data,
      },
    },
    (err, res) => {
      if (err) {
        console.error("Lỗi khi ghi dữ liệu vào Google Sheets:", err);
        return;
      }
      console.log(`Dữ liệu đã ghi vào lúc ${new Date().getHours()}h`);
    }
  );
};

module.exports = { getDataSheet, updateDataSheet, appendDataSheet };
