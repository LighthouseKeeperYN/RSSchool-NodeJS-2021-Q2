const fs = require('fs')
const { pipeline } = require('stream');
const { program } = require('commander');

// program
//   .option('-s, --shift <value>', 'a shift')
//   .option('-i, --input <value>', 'an input file')
//   .option('-o, --output <value>', 'an output file')
//   .option('-a, --action <value>', 'an action encode/decode')
//   .parse(process.argv);
// const { shift, input, output, action } = program.opts();

// const readable = input ? fs.createReadStream(input) : process.stdin
// const writable = output ? fs.createWriteStream(output) : process.stdout

// pipeline(
//   readable,
//   writable,
//   (err) => {
//     if (err) {
//       console.error('Pipeline failed.', err);
//     } else {
//       console.log('Pipeline succeeded.');
//     }
//   },
// )

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

  static _encoder(stream) {
    console.log(stream);
    return stream
  }

  static _decoder(stream) {
    console.log(stream);
    return stream
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
      process.stderr.write('Could not read the file');
      process.exit(1)
    }
  }

  static _runPipeline(readable, writable) {
    this._exceptionHandler()
    pipeline(
      readable,
      this.action === 'encode' ? this._encoder : this._decoder,
      writable,
      this._exceptionHandler
    )
  }

  static run() {
    this._getOptions()
    const readStream = this._getReadStream()
    const writeStream = this._getWriteStream()
    this._runPipeline(readStream, writeStream)
    // console.log('test');
    // if (!readStream) return
    // console.log(readStream);
    // this._getOptions()
    // this._checkErrors()
  }
}

Cypher.run()
// console.log(cypher.getOptions);