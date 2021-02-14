"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _uuid = require("uuid");

var ChestModel = function ChestModel(x, y, bitcoin, spawnerId) {
  (0, _classCallCheck2["default"])(this, ChestModel);
  this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
  this.spawnerId = spawnerId;
  this.x = x;
  this.y = y;
  this.bitcoin = bitcoin;
};

exports["default"] = ChestModel;
//# sourceMappingURL=ChestModel.js.map