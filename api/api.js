const express = require('express');
const apiRoutes = require('./routes');
const app = express();
const port = 6947;

module.exports = () => {
  try {
    app.use('/api', apiRoutes);

    app.listen(port, () => {
      console.log(`Server đang lắng nghe trên cổng ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
