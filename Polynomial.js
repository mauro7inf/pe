let Monomial = require('./Monomial');
let NumberWrapper = require('./NumberWrapper');

function Polynomial(poly) {
  this.type = 'Polynomial';
  this.terms = [];
  if (poly === undefined) {
    return this;
  }
  if (poly instanceof Array) {
    this._addTerms(poly);
  } else if (poly instanceof Polynomial) {
    this._addTerms(poly.terms);
  } else { // monomial
    this._addTerm(poly);
  }
  this._arrangeTerms();
  return this;
}

Polynomial.prototype._addTerms = function (arr) {
  arr.forEach((t) => {
    this._addTerm(t);
  });
};

Polynomial.prototype._addTerm = function (monomial) {
  let m = new Monomial(monomial);
  let found = false;
  for (let i = 0; i < this.terms.length; i++) {
    if (this.terms[i].sameType(m)) {
      found = true;
      this.terms[i] = this.terms[i].add(m);
      if (this.terms[i].coefficient.isZero()) {
        this.terms.splice(i, 1);
      }
      break;
    }
  }
  if (!found) {
    this.terms.push(m);
  }
};

Polynomial.prototype._arrangeTerms = function () {
  this.terms.sort((t1, t2) => {
    return t1.lexicographicalComparison(t2);
  });
};

Polynomial.prototype.add = function (poly) {
  let p = new Polynomial(this);
  let q = poly;
  if (!(q instanceof Polynomial)) {
    q = new Polynomial(q);
  }
  p._addTerms(q.terms);
  p._arrangeTerms();
  return p;
};

Polynomial.prototype.multiply = function (poly) {
  let p = new Polynomial(this);
  let q = poly;
  if (!(q instanceof Polynomial)) {
    q = new Polynomial(q);
  }
  let r = new Polynomial();
  p.terms.forEach((t1) => {
    q.terms.forEach((t2) => {
      r._addTerm(t1.multiply(t2));
    });
  });
  r._arrangeTerms();
  return r;
};

Polynomial.prototype.subtract = function (poly) {
  return this.add(poly.multiply(-1));
};

// a is a regular integer
Polynomial.prototype.exponent = function (a) {
  if (a === 0) {
    return new Polynomial(1);
  }
  let powers = [
    {exponent: 1, power: new Polynomial(this)}
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
  let total = new Polynomial(1);
  while (ar > 0) {
    if (powers[p].exponent <= ar) {
      ar -= powers[p].exponent;
      total = total.multiply(powers[p].power);
    }
    p--;
  }
  return total;
};

Polynomial.prototype.absToString = function () {
  return this.toString(); // nothing special
};

Polynomial.prototype.toString = function () {
  if (this.terms.length === 0) {
    return '0';
  }
  let s = this.terms[0].toString();
  for (let i = 1; i < this.terms.length; i++) {
    s += ' ' + this.terms[i].sign() + ' ' + this.terms[i].absToString();
  }
  return s;
};

Polynomial.prototype.inspect = function () {
  let arr = [];
  for (let i = 0; i < this.terms.length; i++) {
    arr.push(this.terms[i].inspect());
  }
  return arr;
};

// value can be a number or another polynomial
Polynomial.prototype.substitute = function (variable, value) {
  let v = value;
  if (typeof v === 'number') {
    v = new NumberWrapper(v);
  }
  let r = new Polynomial();
  for (let i = 0; i < this.terms.length; i++) {
    let term = new Monomial(this.terms[i]);
    if (term.coefficient instanceof Polynomial) {
      term.coefficient = term.coefficient.substitute(variable, v);
    }
    if (variable in term.variables) {
      term.coefficient = term.coefficient.multiply(v.exponent(term.variables[variable]));
      delete term.variables[variable];
    }
    r._addTerm(term);
  }
  r._arrangeTerms();
  return r.expand();
};

Polynomial.prototype.copy = function () {
  return new Polynomial(this);
};

Polynomial.prototype.isZero = function () {
  return this.terms.length === 0;
};

Polynomial.prototype.isNaN = function () {
  for (let i = 0; i < this.terms.length; i++) {
    if (this.terms[i].coefficient.isNaN()){
      return true;
    }
  }
  return false;
};

Polynomial.prototype.isNumber = function () {
  return this.isZero() ||
    this.isNaN() ||
    (this.terms.length === 1 &&
      Object.keys(this.terms[0].variables).length === 0 &&
      this.terms[0].coefficient instanceof NumberWrapper);
};

// turns to number if number
Polynomial.prototype.reduce = function () {
  if (this.isZero()) {
    return new NumberWrapper(0);
  } else if (this.isNaN()) {
    return new NumberWrapper(NaN);
  } else if (this.isNumber()) {
    return new NumberWrapper(this.terms[0].coefficient);
  } else {
    return this;
  }
};

Polynomial.prototype.expand = function () {
  let r = new Polynomial();
  for (let i = 0; i < this.terms.length; i++) {
    let term = new Polynomial(this.terms[i].vars());
    let coeff = this.terms[i].coefficient;
    if (coeff.type === 'Polynomial') {
      coeff = coeff.expand();
    }
    r = r.add(term.multiply(coeff));
  }
  return r;
};

// example: this.group('x', 'y')
Polynomial.prototype.group = function () {
  let vars = Array.from(arguments);
  let r = new Polynomial();
  for (let i = 0; i < this.terms.length; i++) {
    let term = this.terms[i];
    let coeff = new Polynomial(term);
    for (let j = 0; j < vars.length; j++) {
      coeff = coeff.substitute(vars[j], 1);
    }
    coeff = coeff.reduce();
    let newVariables = {};
    for (let j = 0; j < vars.length; j++) {
      if (vars[j] in term.variables) {
        newVariables[vars[j]] = term.variables[vars[j]];
      }
    }
    let newTerm = {
      coefficient: coeff,
      variables: newVariables
    };
    let newPoly = new Polynomial(newTerm);
    r = r.add(newPoly);
  }
  return r;
};

// finds coefficient of the term with the same type as given monomial
// monomial's coefficient is ignored
Polynomial.prototype.coefficient = function (monomial) {
  let m = monomial;
  if (!(m instanceof Monomial)) {
    m = new Monomial(monomial);
  }
  for (let i = 0; i < this.terms.length; i++) {
    if (this.terms[i].sameType(m)) {
      return this.terms[i].coefficient;
    }
  }
  return new NumberWrapper(0);
};

Polynomial.prototype.term = function (monomial) {
  let m = monomial;
  if (!(m instanceof Monomial)) {
    m = new Monomial(monomial);
  }
  for (let i = 0; i < this.terms.length; i++) {
    if (this.terms[i].sameType(m)) {
      return new Polynomial(this.terms[i]);
    }
  }
  return new Polynomial(0);
}

module.exports = Polynomial;
