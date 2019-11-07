'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore-lib-btg');
var BufferUtil = bitcore.util.buffer;
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

var P2PHeaderAndShortIDs = require('../../p2pheaderandshortids');

function CmpctBlockMessage(arg, options) {
  Message.call(this, options);
  this.command = 'cmpctblock';
  this.headerAndShortIds = null;
}
inherits(CmpctBlockMessage, Message);

CmpctBlockMessage.prototype.setPayload = function(payload) {
  this.headerAndShortIds = P2PHeaderAndShortIDs.fromBuffer(payload)
};

CmpctBlockMessage.prototype.getPayload = function() {
  // Error excepted if headerAndShortIds is null.
  return this.headerAndShortIds.toBuffer()
};

module.exports = CmpctBlockMessage;
