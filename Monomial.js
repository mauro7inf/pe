let NumberWrapper = require('./NumberWrapper');

function Monomial(monomial) {
  this.type = 'Monomial';
  if (monomial === undefined) {
    this.coefficient = new NumberWrapper(0);
    this.variables = {};
    return this;
  }
  if (monomial instanceof Monomial) {
    return new Monomial(monomial.toObject());
  }
  this.variables = {};
  if (typeof monomial === 'number' || monomial instanceof NumberWrapper) {
    this.coefficient = new NumberWrapper(monomial);
    return this;
  }
  this.coefficient = new NumberWrapper(1);
  if ('coefficient' in monomial) {
    if (typeof monomial.coefficient === 'number' || monomial.coefficient instanceof NumberWrapper) {
      this.coefficient = new NumberWrapper(monomial.coefficient);
      if (this.coefficient.number === 0 || isNaN(this.coefficient.number)) {
        return this;
      }
    } else {
      this.coefficient = monomial.coefficient; // coefficient can also be a Polynomial (NOT Monomial)
    }
  }
  if (!('variables' in monomial)) {
    return this;
  }
  for (let variable in monomial.variables) {
    if (monomial.variables[variable] !== 0) {
      this.variables[variable] = monomial.variables[variable];
    }
  }
}

Monomial.prototype.toObject = function () {
  let obj = {
    variables: {}
  };
  obj.coefficient = this.coefficient.copy();
  for (let variable in this.variables) {
    obj.variables[variable] = this.variables[variable];
  }
  return obj;
};

Monomial.prototype.inspect = function () {
  let obj = {
    variables: {}
  };
  obj.coefficient = this.coefficient.inspect();
  for (let variable in this.variables) {
    obj.variables[variable] = this.variables[variable];
  }
  return obj;
};

Monomial.prototype.vars = function () {
  let m = new Monomial(this);
  m.coefficient = new NumberWrapper(1);
  return m;
};

Monomial.prototype.varsToString = function () {
  let variables = Object.keys(this.variables).sort(); // canonical sort
  return variables.map((v) => {
    if (this.variables[v] === 1) {
      return '' + v;
    }
    return '' + v + '^' + this.variables[v];
  }).join('·');
};

Monomial.prototype.absToString = function () {
  let vars = this.varsToString();
  if (this.coefficient instanceof NumberWrapper) {
    let coeff = this.coefficient.absToString();
    if (coeff === '0' || coeff === 'NaN' || vars === '') {
      return '' + coeff;
    } else if (coeff === '1') {
      return this.varsToString();
    } else {
      return '' + coeff + '·' + vars;
    }
  } else {
    if (vars === '') {
      return '(' + this.coefficient.toString() + ')';
    } else {
      return '(' + this.coefficient.toString() + ')·' + vars;
    }
  }
};

Monomial.prototype.sign = function () {
  if (this.coefficient instanceof NumberWrapper && this.coefficient.lessThan(0)) {
    return '-';
  } else {
    return '+';
  }
};

Monomial.prototype.toString = function () {
  if (this.coefficient instanceof NumberWrapper && this.coefficient.lessThan(0)) {
    return '-' + this.absToString();
  } else {
    return this.absToString();
  }
};

// n can be number or Monomial
Monomial.prototype.multiply = function (n) {
  let m = new Monomial(this);
  if (typeof n === 'number' || n instanceof NumberWrapper) {
    m.coefficient = m.coefficient.multiply(n);
    if (m.coefficient.isZero() || m.coefficient.isNaN()) {
      m.variables = {};
    }
    return m;
  }
  m.coefficient = m.coefficient.multiply(n.coefficient);
  if (m.coefficient.isZero() || m.coefficient.isNaN()) {
    m.variables = {};
    return m;
  }
  let variables = Object.keys(n.variables);
  variables.forEach((v) => {
    if (v in m.variables) {
      m.variables[v] += n.variables[v];
    } else {
      m.variables[v] = n.variables[v];
    }
    if (m.variables[v] === 0) {
      delete m.variables[v];
    }
  });
  return m;
};

Monomial.prototype.isZero = function () {
  return this.coefficient.isZero();
};

Monomial.prototype.isNaN = function () {
  return this.coefficient.isNaN();
}

Monomial.prototype.sameType = function (monomial) {
  let n = monomial;
  if (!(n instanceof Monomial)) {
    n = new Monomial(n);
  }
  if (this.isZero() || n.isZero()) {
    return true;
  }
  return this.varsToString() === n.varsToString();
};

Monomial.prototype.add = function (monomial) {
  let n = monomial;
  if (!(n instanceof Monomial)) {
    n = new Monomial(n);
  }
  if (!this.sameType(n)) {
    return undefined;
  }
  let m = new Monomial(this);
  if (m.isZero()) {
    return new Monomial(n);
  } else if (n.isZero()) {
    return m;
  }
  m.coefficient = m.coefficient.add(n.coefficient);
  if (m.coefficient.isZero() || m.coefficient.isNaN()) {
    m.variables = {};
  }
  return m;
};

Monomial.prototype.degree = function () {
  let d = 0;
  let variables = Object.keys(this.variables);
  variables.forEach((v) => {
    d += this.variables[v];
  });
  return d;
};

Monomial.prototype.lexicographicalComparison = function (monomial) {
  let n = monomial;
  if (!(n instanceof Monomial)) {
    n = new Monomial(n);
  }
  let d1 = this.degree();
  let d2 = n.degree();
  if (d1 > d2) {
    return -1;
  } else if (d1 < d2) {
    return 1;
  }
  let vars1 = Object.keys(this.variables).sort();
  let vars2 = Object.keys(n.variables).sort();
  for (let i = 0; i < vars1.length && i < vars2.length; i++) {
    if (vars1[i] < vars2[i]) {
      return -1;
    } else if (vars1[i] > vars2[i]) {
      return 1;
    }
    if (this.variables[vars1[i]] > n.variables[vars2[i]]) {
      return -1;
    } else if (this.variables[vars1[i]] < n.variables[vars2[i]]) {
      return 1;
    }
  }
  if (vars1.length < vars2.length) {
    return -1;
  } else if (vars1.length > vars2.length) {
    return 1;
  }
  return 0;
};

Monomial.prototype.copy = function () {
  return new Monomial(this);
};

module.exports = Monomial;
