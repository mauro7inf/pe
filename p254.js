let LargeInteger = require('./LargeInteger');

let N = +(process.argv[2]);

const M = 0; // preload because why not, takes less than half a second -- OK, don't actually preload, because the format changed

let factorials = [1];
for (let i = 1; i <= 9; i++) {
  factorials[i] = factorials[i - 1]*i;
}

function f(n) {
  let str = "" + n;
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    total += factorials[+(str.charAt(i))];
  }
  return total;
}

function s(n) {
  let str = "" + n;
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    total += +(str.charAt(i));
  }
  return total;
}

function sf(n) {
  return s(f(n));
}

let gCount = 0; // count of non-zero entries in g so far; quicker to just cache this instead of computing it every time
let g = [0];
/*for (let i = 1; i <= N; i++) {
  g[i] = 0;
}*/


if (M > N) {
  M = N;
}

let current = [1];
while (gCount < M) {
  // check if this is a new entry
  let num = current.join('');
  let a = sf(num);
  if (!(a in g)) {
    g[a] = num;
    let spaces = '    ';
    if (a <= M) {
      gCount++;
      spaces = '';
    }
    console.log(spaces + 'sf(' + num + ') = ' + a + ' (f = ' + f(num) + ')');
  }
  // increment
  let digit = current.length - 1; // digit index
  while (digit >= 0 && current[digit] == 9) {
    digit--;
  }
  if (digit == -1) {
    current[0] = 1;
    let l = current.length; // this is rolling over something like 999 into 1000, and we want i <= l so that the final 0 can be added
    for (let i = 1; i <= l && i <= 4; i++) {
      current[i] = 2; // there will never be more than one 1 since 2·1! = 2!
    }
    for (let i = 5; i <= l; i++) {
      current[i] = 3; // there will never be more than three 2's since 3·2! = 3!
    }
  } else {
    if (current[digit] == 0) {
      current[digit] += 2;
    } else {
      current[digit]++;
    }
    for (let i = digit + 1; i < current.length; i++) {
      current[i] = current[digit];
    }
  }
}

class Partition {
  constructor(sum, digits, fixedDigits) {
    this.sum = sum;
    this.digits = digits;
    this.fixedDigits = fixedDigits;
    if (this.fixedDigits === undefined) {
      this.fixedDigits = true;
    }
    if (this.digits === undefined) {
      this.digits = Math.ceil(this.sum/9);
      this.fixedDigits = false;
    }
    if (9*this.digits < this.sum) {
      return null;
    }
    if (this.digits === 1) {
      this.d = this.sum;
      this.remainder = null;
    } else {
      if (this.sum - 9*(this.digits - 1) > 0) {
        this.d = this.sum - 9*(this.digits - 1);
      } else {
        if (this.fixedDigits) {
          this.d = 0;
        } else {
          this.d = 1;
        }
      }
      this.remainder = new Partition(this.sum - this.d, this.digits - 1, true);
    }
    return this;
  }

  toNumber() {
    let str = '' + this.d;
    if (this.remainder !== null) {
      str += this.remainder.toNumber();
    }
    return str;
  }

  toString() {
    let str = '' + this.d;
    if (this.remainder !== null) {
      str += ' + ' + this.remainder.toString();
    }
    return str;
  }

  increment() { // sometimes modifies the object; should always be called as p = p.increment();
    if (this.remainder === null) {
      if (this.fixedDigits) {
        return null;
      } else {
        return new Partition(this.sum, this.digits + 1, false);
      }
    }
    this.remainder = this.remainder.increment();
    if (this.remainder === null) {
      if (this.d < 9 && this.d < this.sum) {
        this.d++;
        this.remainder = new Partition(this.sum - this.d, this.digits - 1, true);
        return this;
      } else {
        if (this.fixedDigits) {
          return null;
        } else {
          return new Partition(this.sum, this.digits + 1, false);
        }
      }
    }
    return this;
  }

  factorialBase() {
    let fits = [0];
    let total = new LargeInteger(this.toNumber());
    for (let fac = 9; fac >= 1; fac--) {
      let division = total.divide(new LargeInteger(factorials[fac]));
      fits[fac] = +(division.quotient.toString());
      total = division.remainder;
    }
    return fits;
  }
}

const sumReducer = (acc, cur) => acc + cur;

function sumFits(fits) {
  if (fits === null) {
    return Infinity;
  }
  return fits.reduce(sumReducer);
}

function smallerFits(fits1, fits2) {
  let size1 = sumFits(fits1);
  let size2 = sumFits(fits2);
  if (size1 > size2) {
    return fits2;
  } else if (size2 > size1) {
    return fits1;
  }
  for (let i = 1; i < 9; i++) {
    if (fits1[i] > fits2[i]) { // this means that fits1 has more of a number, so fits2 moves to a higher number sooner so it's bigger
      return fits1;
    } else if (fits2[i] > fits1[i]) {
      return fits2;
    }
  }
  return fits1; // they're equal so just pick the first one
}

function printFits(fits) {
  let str = '' + fits[1] + 'x1';
  for (let j = 2; j <= 9; j++) {
    str += ' + ' + fits[j] + 'x' + j;
  }
  return str;
}

function expandFits(fits) {
  let total = new LargeInteger(0);
  for (let j = 1; j <= 9; j++) {
    total = total.add((new LargeInteger(fits[j])).multiply(new LargeInteger(factorials[j])));
  }
  return total;
}

console.log('---------');

for (let i = M + 1; i <= N; i++) {
  if (i in g) {
    continue;
  }
  let minFits = null;
  let p = new Partition(i);
  //console.log(p.toNumber() + ' (' + p.toString() + ')');
  //console.log('hello');
  while (minFits === null ||
    (new LargeInteger(p.toNumber())).quotient(new LargeInteger(factorials[9])).lessThanOrEqualTo(new LargeInteger(sumFits(minFits)))) {
  //while ((+p.toNumber())/factorials[9] <= sumFits(minFits)) {
    //console.log('hi');
    //console.log(p.factorialBase());
    minFits = smallerFits(minFits, p.factorialBase());
    p = p.increment();
    //console.log(p.toNumber() + ' (' + p.toString() + ')');
  }
  /*let str = '';
  for (let j = 1; j <= 9; j++) {
    for (let k = 1; k <= minFits[j]; k++) {
      str += j;
    }
  }*/
  g[i] = minFits;
  console.log('sf(' + printFits(g[i]) + ') = ' + i + ' (f = ' + expandFits(g[i]).toString() + ')');
}

function sg(i) {
  //return s(g[i]);
  let total = 0;
  for (let j = 1; j <= 9; j++) {
    total += j*g[i][j];
  }
  return total;
}

function sumSg(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += sg(i);
  }
  return total;
}

console.log(sumSg(N));