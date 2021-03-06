"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var ChatSchema = new Schema({
  email: {
    type: String,
    required: true // unique: false, // a unique id should be used eventually

  },
  message: {
    type: String,
    required: true
  }
});

var ChatModel = _mongoose["default"].model('chat', ChatSchema);

module.exports = ChatModel;
var _default = ChatModel;
exports["default"] = _default;
//# sourceMappingURL=ChatModel.js.map