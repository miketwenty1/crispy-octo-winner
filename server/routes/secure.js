import express from 'express';
import ChatModel from '../models/ChatModel';

const router = express.Router();

router.post('/chat', async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({
      message: 'invalid body',
      status: 400,
    });
  } else {
    const { message } = req.body;
    const { email } = req.user;
    // console.log(`${JSON.stringify(req.user.name)}: ${req.body.message}`);
    const chat = await ChatModel.create({ email, message });
    res.status(200).json({
      chat,
      message: 'message sent',
      status: 200,
    });
  }
});

export default router;
