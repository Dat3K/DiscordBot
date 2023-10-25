module.exports = async (message, listMessageRow) => {
  try {
    if (listMessageRow.length === 0) return;
    const random = () => {
      return Math.floor(Math.random() * listMessageRow.length);
    };
    const listMessage = listMessageRow.map((row) => {
      return row.content;
    });
    await message.reply(listMessage[random()]);
  } catch (error) {
    console.error(error);
  }
};
