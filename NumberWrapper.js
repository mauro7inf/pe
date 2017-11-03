function NumberWrapper(n) {
  this.type = 'NumberWrapper';
  if (n instanceof NumberWrapper) {
    this.number = n.number;
  } else {
    this.number = +n;
  }
}

NumberWrapper.prototype.add = function (num) {
  if (num.type === 'Polynomial') {
    return num.add(this);
  }
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return new NumberWrapper(this.number + n);
};

NumberWrapper.prototype.subtract = function (num) {
  if (num.type === 'Polynomial') {
    return num.subtract(this).multiply(-1);
  }
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return new NumberWrapper(this.number - n);
};

NumberWrapper.prototype.multiply = function (num) {
  if (num.type === 'Polynomial') {
    return num.multiply(this);
  }
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return new NumberWrapper(this.number * n);
};

NumberWrapper.prototype.exponent = function (num) {
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return new NumberWrapper(Math.pow(this.number, n));
};

NumberWrapper.prototype.greaterThan = function (num) {
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return this.number > n;
};

NumberWrapper.prototype.greaterThanOrEqualTo = function (num) {
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return this.number >= n;
};

NumberWrapper.prototype.equals = function (num) {
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return this.number === n;
};

NumberWrapper.prototype.isZero = function () {
  return this.equals(0);
}

NumberWrapper.prototype.lessThanOrEqualTo = function (num) {
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return this.number <= n;
};

NumberWrapper.prototype.lessThan = function (num) {
  let n = num;
  if (n instanceof NumberWrapper) {
    n = n.number;
  }
  return this.number < n;
};

NumberWrapper.prototype.isNaN = function () {
  return isNaN(this.number);
};

NumberWrapper.prototype.absToString = function () {
  return '' + Math.abs(this.number);
};

NumberWrapper.prototype.toString = function () {
  return '' + this.number;
};

NumberWrapper.prototype.copy = function () {
  return new NumberWrapper(this);
};

NumberWrapper.prototype.inspect = function () {
  return this.number;
};

module.exports = NumberWrapper;
