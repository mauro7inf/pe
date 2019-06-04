function LargeInteger(number) {
  if (typeof number === 'number') {
    this.number = '' + Math.abs(number);
    if (number >= 0) {
      this.sign = 1;
    } else {
      this.sign = -1;
    }
  } else if (typeof number === 'string') {
    if (number.charAt(0) === '-') {
      this.sign = -1;
      this.number = number.substr(1);
    } else {
      this.sign = 1;
      this.number = number;
    }
  } else if (number instanceof LargeInteger) {
    this.sign = number.sign;
    this.number = number.number;
  }
  this.trim();
}

LargeInteger.prototype.trim = function () {
  while (this.number.length > 1 && this.number.charAt(0) === '0') {
    this.number = this.number.substr(1);
  }
  if (this.number === '0') {
    this.sign = 1; // just making an executive decision here
  }
  return this;
};

LargeInteger.prototype.absToString = function () {
  return '' + this.number;
};

LargeInteger.prototype.toString = function () {
  let string = this.number;
  if (this.sign === -1) {
    string = '-' + string;
  }
  return string;
};

LargeInteger.prototype.copy = function () {
  return new LargeInteger(this);
};

LargeInteger.prototype.abs = function () {
  return new LargeInteger(this.number);
};

LargeInteger.prototype.flipSign = function () {
  if (this.number === '0') {
    this.sign = 1;
    return this;
  }
  let string = this.number;
  if (this.sign === 1) {
    string = '-' + string;
  }
  return new LargeInteger(string);
};

LargeInteger.prototype.multiplyByPowerOf10 = function (k) {
  let string = this.number;
  for (let d = 1; d <= k; d++) {
    string += '0';
  }
  if (this.sign === -1) {
    string = '-' + string;
  }
  return new LargeInteger(string);
};

LargeInteger.prototype.add = function (a) {
  if (!(a instanceof LargeInteger)) {
    return this.add(new LargeInteger(a));
  }
  if (this.sign === 1 && a.sign === -1) {
    return this.subtract(a);
  } else if (this.sign === -1 && a.sign === 1) {
    return a.subtract(this);
  }
  let carry = 0;
  let digits = [];
  for (let d = 0; d < this.number.length || d < a.number.length; d++) {
    let result = carry;
    if (d < this.number.length) {
      result += +this.number.charAt(this.number.length - d - 1);
    }
    if (d < a.number.length) {
      result += +a.number.charAt(a.number.length - d - 1);
    }
    if (result >= 10) {
      carry = 1;
    } else {
      carry = 0;
    }
    digits.push('' + (result % 10));
  }
  digits.push(carry);
  let string = '';
  for (let d = 0; d < digits.length; d++) {
    string = '' + digits[d] + string;
  }
  if (this.sign === -1) {
    string = '-' + string;
  }
  return new LargeInteger(string);
};

LargeInteger.prototype.subtract = function (a) {
  if (!(a instanceof LargeInteger)) {
    return this.subtract(new LargeInteger(a));
  }
  if (this.sign === 1 && a.sign === -1 && this.sign === -1 && a.sign === 1) {
    return this.add(a.flipSign());
  } else if (this.sign === -1 && a.sign === -1) {
    return a.flipSign().subtract(this.flipSign());
  }
  if (this.lessThan(a)) {
    return a.subtract(this).flipSign();
  }
  let borrow = 0;
  let digits = [];
  for (let d = 0; d < this.number.length; d++) {
    let result = +this.number.charAt(this.number.length - d - 1) - borrow;
    if (d < a.number.length) {
      result -= +a.number.charAt(a.number.length - d - 1);
    }
    if (result < 0) {
      borrow = 1;
      result += 10;
    } else {
      borrow = 0;
    }
    digits.push('' + (result));
  }
  let string = '';
  for (let d = 0; d < digits.length; d++) {
    string = '' + digits[d] + string;
  }
  return new LargeInteger(string);
};

// assumes a and b are plain strings of digits
// internal function only
function multiplyStrings(a, b) {
  if (b.length > a.length) {
    return multiplyStrings(b, a);
  }
  let terms = [];
  for (let i = 0; i < b.length; i++) {
    let carry = 0;
    let digits = [];
    for (let j = 0; j < a.length; j++) {
      let result = carry + (+b.charAt(b.length - i - 1))*(+a.charAt(a.length - j - 1));
      let digit = result % 10;
      carry = (result - digit)/10;
      digits.push(digit);
    }
    digits.push(carry);
    let string = '';
    for (let d = 0; d < digits.length; d++) {
      string = '' + digits[d] + string;
    }
    for (let k = 1; k <= i; k++) {
      string += '0';
    }
    terms.push(new LargeInteger(string));
  }
  while (terms.length > 1) {
    let newTerms = [];
    for (let i = 0; i < terms.length; i += 2) {
      if (i < terms.length - 1) {
        newTerms.push(terms[i].add(terms[i + 1]));
      } else {
        newTerms.push(terms[i]);
      }
    }
    terms = newTerms;
  }
  return terms[0];
}

LargeInteger.prototype.multiply = function (a) {
  if (!(a instanceof LargeInteger)) {
    return this.multiply(new LargeInteger(a));
  }
  let absProduct = multiplyStrings(this.number, a.number);
  if (this.sign * a.sign === -1) {
    return absProduct.flipSign();
  } else {
    return absProduct;
  }
};

// returns object with quotient and remainder
// signs for quotient and remainder are the same
LargeInteger.prototype.divide = function (a) {
  if (!(a instanceof LargeInteger)) {
    return this.divide(new LargeInteger(a));
  }
  if (a.equals(new LargeInteger(0))) {
    return null; // I guess?
  }
  if (this.sign === -1 && a.sign === -1) {
    return this.flipSign().divide(a.flipSign());
  } else if (this.sign === -1) {
    let answer = this.flipSign().divide(a);
    answer.quotient = answer.quotient.flipSign();
    answer.remainder = answer.remainder.flipSign();
    return answer;
  } else if (a.sign === -1) {
    let answer = this.divide(a.flipSign());
    answer.quotient = answer.quotient.flipSign();
    answer.remainder = answer.remainder.flipSign();
    return answer;
  }
  if (this.lessThan(a)) {
    return {
      quotient: new LargeInteger(0),
      remainder: this
    };
  }
  let multiples = [new LargeInteger(0)];
  for (let i = 1; i <= 9; i++) {
    multiples.push(multiples[multiples.length - 1].add(a));
  }
  let digits = [];
  let current = new LargeInteger(0);
  for (let d = 0; d < this.number.length; d++) {
    let acc = new LargeInteger(current.toString() + '' + this.number.charAt(d));
    let digit = 9;
    while (acc.lessThan(multiples[digit])) {
      digit--;
    }
    digits.push(digit);
    current = acc.subtract(multiples[digit]);
  }
  let quotient = new LargeInteger(digits.join(''));
  return {
    quotient: quotient,
    remainder: current
  };
};

LargeInteger.prototype.quotient = function (a) {
  return this.divide(a).quotient;
};

LargeInteger.prototype.mod = function (a) {
  return this.divide(a).remainder;
};

// a is a regular integer, not a LargeInteger
LargeInteger.prototype.exponent = function (a) {
  if (a === 0) {
    return new LargeInteger(1);
  }
  let powers = [
    {exponent: 1, power: this.copy()}
  ];
  while (2*powers[powers.length - 1].exponent <= a) {
    let currentPower = powers[powers.length - 1];
    powers.push({
      exponent: currentPower.exponent*2,
      power: currentPower.power.multiply(currentPower.power)
    });
  }
  let ar = a;
  let p = powers.length - 1;
  let total = new LargeInteger(1);
  while (ar > 0) {
    if (powers[p].exponent <= ar) {
      ar -= powers[p].exponent;
      total = total.multiply(powers[p].power);
    }
    p--;
  }
  return total;
};

// a is a regular integer, not a LargeInteger
LargeInteger.prototype.exponentMod = function (a, m) {
  if (a === 0) {
    return new LargeInteger(1);
  }
  let powers = [
    {exponent: 1, power: this.copy().mod(m)}
  ];
  while (2*powers[powers.length - 1].exponent <= a) {
    let currentPower = powers[powers.length - 1];
    powers.push({
      exponent: currentPower.exponent*2,
      power: currentPower.power.multiply(currentPower.power).mod(m)
    });
  }
  let ar = a;
  let p = powers.length - 1;
  let total = new LargeInteger(1);
  while (ar > 0) {
    if (powers[p].exponent <= ar) {
      ar -= powers[p].exponent;
      total = total.multiply(powers[p].power).mod(m);
    }
    p--;
  }
  return total;
};

LargeInteger.prototype.digitSum = function () {
  let total = 0;
  for (let i = 0; i < this.number.length; i++) {
    total += +this.number.charAt(i);
  }
  return total;
};

LargeInteger.prototype.equals = function (a) {
  if (this.sign !== a.sign) {
    return false;
  }
  if (this.number.length !== a.number.length) {
    return false;
  }
  for (let d = 0; d < this.number.length; d++) {
    if (this.number.charAt(d) !== a.number.charAt(d)) {
      return false;
    }
  }
  return true;
};

LargeInteger.prototype.lessThan = function (a) {
  if (this.sign === -1 && a.sign === 1) {
    return true;
  } else if (this.sign === 1 && a.sign === -1) {
    return false;
  } else if (this.sign === -1 && a.sign === -1) {
    return a.flipSign().lessThan(this.flipSign());
  }
  if (this.number.length < a.number.length) {
    return true;
  } else if (this.number.length > a.number.length) {
    return false;
  }
  for (let d = 0; d < this.number.length; d++) {
    if (this.number.charAt(d) > a.number.charAt(d)) {
      return false;
    } else if (this.number.charAt(d) < a.number.charAt(d)) {
      return true;
    }
  }
  return false;
};

LargeInteger.prototype.greaterThan = function (a) {
  return a.lessThan(this);
};

LargeInteger.prototype.lessThanOrEqualTo = function (a) {
  return !(a.lessThan(this));
};

LargeInteger.prototype.greaterThanOrEqualTo = function (a) {
  return !(this.lessThan(a));
};

LargeInteger.gcd = function (a, b) {
  let zero = new LargeInteger(0);
  if (a.equals(zero)) {
    return b;
  } else if (b.equals(zero)) {
    return a;
  }
  let A = a;
  let B = b;
  let r = A.mod(B);
  while (r.greaterThan(zero)) {
    A = B;
    B = r;
    r = A.mod(B);
  }
  return B;
};

module.exports = LargeInteger;
