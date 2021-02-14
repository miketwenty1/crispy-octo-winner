import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChatSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // a unique id should be used eventually
  },
  message: {
    type: String,
    required: true,
  },
});

const ChatModel = mongoose.model('chat', ChatSchema);

module.exports = ChatModel;
export default ChatModel;
