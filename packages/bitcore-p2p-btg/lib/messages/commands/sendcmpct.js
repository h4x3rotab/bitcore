'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore-lib-btg');
var BufferUtil = bitcore.util.buffer;
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

function SendCmpctMessage(arg, options) {
  Message.call(this, options);
  this.command = 'sendcmpct';
  this.announce = false;
  this.version = new bitcore.crypto.BN(0);
}
inherits(SendCmpctMessage, Message);

SendCmpctMessage.prototype.setPayload = function(payload) {
  const r = new BufferReader(payload);
  this.announce = !!r.readUInt8();
  this.version = r.readUInt64LEBN();
};

SendCmpctMessage.prototype.getPayload = function() {
  const w = new BufferWriter();
  w.writeUInt8(this.announce ? 1 : 0);
  w.writeUInt64LEBN(this.version);
  return w.toBuffer();
};

module.exports = SendCmpctMessage;
