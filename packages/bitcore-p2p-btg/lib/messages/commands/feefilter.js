'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore-lib-btg');
var BufferUtil = bitcore.util.buffer;
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

function FeeFilterMessage(arg, options) {
  Message.call(this, options);
  this.command = 'feefilter';
  this.feerate = 0;
}
inherits(FeeFilterMessage, Message);

FeeFilterMessage.prototype.setPayload = function(payload) {
  const reader = new BufferReader(payload);
  this.feerate = reader.readUInt64LEBN();
};

FeeFilterMessage.prototype.getPayload = function() {
  const writer = new BufferWriter();
  writer.writeUint64LEBN(this.feerate);
  return writer.toBuffer();
};

module.exports = FeeFilterMessage;
