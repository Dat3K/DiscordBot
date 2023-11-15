const express = require('express');
const Question = require('./models/question');
const Sequelize = require('sequelize');
const router = express.Router();

router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/question/:id', async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/question/random', async (req, res) => {
  try {
    const { number } = req.query;
    console.log(number);
    const questions = await Question.findAll({
      order: [Sequelize.literal('RAND()')],
      limit: number,
    });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
