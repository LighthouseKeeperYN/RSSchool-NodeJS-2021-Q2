const fs = require('fs')
const { pipeline } = require('stream');
const { program } = require('commander');
const Encoder = require('./encoder')

// todo: handle input file error

class CLI {
  shift
  input
  output
  action

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
    if (!this.input) {
      return process.stdin
    }
    return fs.createReadStream(this.input);
  }

  static _getWriteStream() {
    if (!this.output) {
      return process.stdout
    }
    return fs.createWriteStream(this.output)
  }

  static _exceptionHandler = (err) => {
    if (!this.shift) {
      process.stderr.write('Shift is required');
      process.exit(9)
    }
    if (isNaN(this.shift)) {
      process.stderr.write('Invalid shift value');
      process.exit(9)
    }
    if (!this.action) {
      process.stderr.write('Action is required');
      process.exit(9)
    }
    if (this.action !== 'encode' && this.action !== 'decode') {
      process.stderr.write('Unrecognized action');
      process.exit(9)
    }
    if (err) {
      process.stderr.write('Unexpected error ocurred');
      console.error(err)
      process.exit(1)
    }
  }

  static _runPipeline(readable, writable) {
    this._exceptionHandler()

    pipeline(
      readable,
      new Encoder({ input: readable, action: this.action, shift: this.shift }),
      writable,
      this._exceptionHandler
    )
  }

  static run() {
    this._getOptions()
    const readStream = this._getReadStream()
    const writeStream = this._getWriteStream()
    this._runPipeline(readStream, writeStream)
  }
}

CLI.run()