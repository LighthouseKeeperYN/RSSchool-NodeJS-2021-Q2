const fs = require('fs')
const { pipeline } = require('stream');
const { program } = require('commander');

class Cypher {
  static shift
  static input
  static output
  static action

  static _getOptions() {
    program
      .option('-s, --shift <value>', 'a shift')
      .option('-i, --input <value>', 'an input file')
      .option('-o, --output <value>', 'an output file')
      .option('-a, --action <value>', 'an action encode/decode')
      .parse(process.argv);

    const { shift, input, output, action } = program.opts()
    this.shift = shift
    this.input = input
    this.output = output
    this.action = action
  }

  static _getReadStream() {

  }

  static _getWriteStream() {

  }

  static _encoder(stream) {
  }

  static _decoder(stream) {
  }

  static _runPipeline(readable, writable) {

  }

  static run() {
    this._getOptions()
  }
}

Cypher.run()