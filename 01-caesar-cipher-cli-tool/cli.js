const fs = require('fs')
const { pipeline } = require('stream');
const { program } = require('commander');
const Codec = require('./codec')

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

    if (!shift) {
      process.stderr.write('Shift is required');
      process.exit(9)
    }
    if (isNaN(shift) || !Number.isInteger(+shift)) {
      process.stderr.write('Invalid shift value');
      process.exit(9)
    }
    if (!action) {
      process.stderr.write('Action is required');
      process.exit(9)
    }
    if (action !== 'encode' && action !== 'decode') {
      process.stderr.write('Unrecognized action');
      process.exit(9)
    }

    this.shift = shift
    this.input = input
    this.output = output
    this.action = action
  }

  static _getReadStream() {
    if (!this.input) {
      return process.stdin
    }

    if (!fs.existsSync(this.input)) {
      process.stderr.write('Input file does not exist');
      process.exit(1)
    }

    return fs.createReadStream(this.input).on('error', () => {
      process.stderr.write('Could not read from input file');
      process.exit(1)
    })
  }

  static _getWriteStream() {
    if (!this.output) {
      return process.stdout
    }

    if (!fs.existsSync(this.output)) {
      process.stderr.write('Output file does not exist');
      process.exit(1)
    }

    return fs.createWriteStream(this.output, {
      flags: 'a'
    }).on('error', () => {
      process.stderr.write('Could not write to output file');
      process.exit(1)
    })
  }

  static _exceptionHandler = (err) => {
    if (err) {
      process.stderr.write('Unexpected error ocurred');
      console.error(err)
      process.exit(1)
    }
  }

  static _runPipeline(readable, writable) {
    pipeline(
      readable,
      new Codec({ input: readable, action: this.action, shift: this.shift }),
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