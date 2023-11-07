const express = require('express');
const router = express.Router();

router.get('/dulieu', (req, res) => {
  // Xử lý logic để trả về dữ liệu
  res.json({ message: 'Xin chào từ RESTful API!' });
});

module.exports = router;
