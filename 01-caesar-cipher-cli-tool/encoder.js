const { exit } = require('process');
const { Transform } = require('stream');

class Encoder extends Transform {
  constructor(options) {
    super(options)

    this.action = options.action
    this.shift = Number(options.shift)
  }

  _LOWER_CASE_STARTS_AT = 97
  _UPPER_CASE_STARTS_AT = 65
  _CHARACTERS_IN_ALPHABET = 26

  _isLowerCase(char) {
    return char.charCodeAt() >= this._LOWER_CASE_STARTS_AT
      && char.charCodeAt() <= this._LOWER_CASE_STARTS_AT + this._CHARACTERS_IN_ALPHABET - 1
  }

  _isUpperCase(char) {
    return char.charCodeAt() >= this._UPPER_CASE_STARTS_AT
      && char.charCodeAt() <= this._UPPER_CASE_STARTS_AT + this._CHARACTERS_IN_ALPHABET - 1
  }

  _shiftCharacter(char, shift) {
    const charCode = char.charCodeAt()
    if (!this._isLowerCase(char) && !this._isUpperCase) {
      process.stderr.write('Can not read input string');
      process.exit(1)
    }

    if (char === '\r') return '\r'
    if (char === '\n') return '\n'

    const start = this._isLowerCase(char) ? this._LOWER_CASE_STARTS_AT : this._UPPER_CASE_STARTS_AT
    const roundedShift = shift % this._CHARACTERS_IN_ALPHABET
    const shiftedCharCode = ((charCode - start + roundedShift + this._CHARACTERS_IN_ALPHABET)
      % this._CHARACTERS_IN_ALPHABET)
      + start

    return String.fromCharCode(shiftedCharCode)
  }

  _encode(inputString) {
    const chars = inputString.split('')
    return chars.reduce((acc, char) => acc + this._shiftCharacter(char, this.shift), '')
  }

  _decode(inputString) {
    const chars = inputString.split('')
    return chars.reduce((acc, char) => acc + this._shiftCharacter(char, -this.shift), '')
  }

  _transform(chunk, _, cb) {
    try {
      const inputString = chunk.toString()

      if (this.action === 'encode') {
        cb(null, this._encode(inputString));
      } else {
        cb(null, this._decode(inputString));
      }
    } catch (err) {
      cb(err);
    }
  }
}


module.exports = Encoder