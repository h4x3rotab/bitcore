'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore-lib-btg');
var BufferUtil = bitcore.util.buffer;

function SendHeadersMessage(arg, options) {
  Message.call(this, options);
  this.command = 'sendheaders';
}
inherits(SendHeadersMessage, Message);

SendHeadersMessage.prototype.setPayload = function() {};

SendHeadersMessage.prototype.getPayload = function() {
  return BufferUtil.EMPTY_BUFFER;
};

module.exports = SendHeadersMessage;
