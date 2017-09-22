let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = new LargeInteger(process.argv[2]);

let M = Number.MAX_SAFE_INTEGER + 1;

/*for (let n = 1; n <= N; n++) {
  let s = NumberTheory.sumOfFactors(n);
  let r = (s/n - 1/2);
  if (r == Math.floor(r)) {
    console.log('----n = ' + n + ', p(n) = ' + r + ' 1/2');
    console.log(NumberTheory.factor(n));
  }
  if (Math.floor(s/n) == s/n) {
    //console.log('\t\tn = ' + n + ', p(n) = ' + s/n);
    //console.log(NumberTheory.factor(n));
  }
}*/

function multiplyFactors(a) { // with LargeInteger instances
  let pFactors = NumberTheory.primeFactors(a);
  let total = new LargeInteger(1);
  for (let i = 0; i < pFactors.length; i++) {
    for (let j = 0; j < a[pFactors[i]]; j++) {
      total = total.multiply(pFactors[i]);
    }
  }
  return total;
}

function printFactors(a) {
  let msg = '';
  let pFactors = NumberTheory.primeFactors(a);
  for (let i = 0; i < pFactors.length; i++) {
    msg += '(' + pFactors[i] + '^' + a[pFactors[i]] + ')';
  }
  return msg;
}

function printBalance(b) {
  let num = multiplyFactors(b.num);
  let den = multiplyFactors(b.den);
  return num.toString() + '/' + den.toString();
}

function addBalances(b1, b2) {
  let b = {
    num: {},
    den: {}
  };
  let b1NumKeys = Object.keys(b1.num);
  for (let i = 0; i < b1NumKeys.length; i++) {
    b.num[b1NumKeys[i]] = b1.num[b1NumKeys[i]];
  }
  let b1DenKeys = Object.keys(b1.den);
  for (let i = 0; i < b1DenKeys.length; i++) {
    b.den[b1DenKeys[i]] = b1.den[b1DenKeys[i]];
  }
  let b2NumKeys = Object.keys(b2.num);
  for (let i = 0; i < b2NumKeys.length; i++) {
    let k = b2NumKeys[i];
    let v = b2.num[k];
    if (k in b.num) {
      b.num[k] += v;
    } else if (k in b.den) {
      if (b.den[k] > v) {
        b.den[k] -= v;
      } else if (b.den[k] < v) {
        b.num[k] = v - b.den[k];
        delete b.den[k];
      } else {
        delete b.den[k];
      }
    } else {
      b.num[b2NumKeys[i]] = b2.num[b2NumKeys[i]];
    }
  }
  let b2DenKeys = Object.keys(b2.den);
  for (let i = 0; i < b2DenKeys.length; i++) {
    let k = b2DenKeys[i];
    let v = b2.den[k];
    if (k in b.den) {
      b.den[k] += v;
    } else if (k in b.num) {
      if (b.num[k] > v) {
        b.num[k] -= v;
      } else if (b.num[k] < v) {
        b.den[k] = v - b.num[k];
        delete b.num[k];
      } else {
        delete b.num[k];
      }
    } else {
      b.den[k] = v;
    }
  }
  return b;
}

function checkBalance(balance) {
  return Object.keys(balance.den).length === 1 && '2' in balance.den && balance.den[2] === 1;
}

let primesSoFar = [2];
let primePowers = [];

for (let i = 0; i < primesSoFar.length; i++) {
  let p = primesSoFar[i];
  let prime = {
    prime: p,
    powers: []
  };
  for (let a = 1; Math.pow(p, a + 1) <= M; a++) {
    let powerFactors = {};
    powerFactors[p] = a;
    let saFactors = NumberTheory.factor(NumberTheory.sumOfFactors(powerFactors));
    //console.log(p + '^' + a + ' = ' + multiplyFactors(powerFactors).toString() + '; sum: ' + printFactors(saFactors));
    let power = {
      primePower: powerFactors,
      sumOfFactors: saFactors
    };
    prime.powers.push(power);
    let pFactors = NumberTheory.primeFactors(saFactors);
    for (let j = 0; j < pFactors.length; j++) {
      let q = pFactors[j];
      if (primesSoFar.indexOf(q) === -1) {
        primesSoFar.push(q);
      }
    }
  }
  primePowers.push(prime);
}

primePowers.sort((a, b) => {
  return a.prime - b.prime;
});

function getPrimePower(a) {
  return primePowers[a[0]].powers[a[1]];
}

function nextPrime(a) {
  if (a[0] + 1 === primePowers.length) {
    return null;
  } else {
    return [a[0] + 1, 0];
  }
}

function nextIndex(a) {
  if (a[1] + 1 === primePowers[a[0]].powers.length) {
    return nextPrime(a);
  } else {
    return [a[0], a[1] + 1];
  }
}

function checkLimits(power, limits) {
  let limitPrimes = Object.keys(limits);
  for (let i = 0; i < limitPrimes.length; i++) {
    let p = limitPrimes[i];
    if (p in power.sumOfFactors && power.sumOfFactors[p] > limits[p]) {
      return false;
    }
  }
  return true;
}

console.log('Prime powers: GENERATED!');

let answers = [];

function printAnswers() {
  let answerStrings = answers.map((e) => {return e.toString();});
  let msg = answerStrings.join(', ');
  return 'So far: ' + msg;
}

for (let i = 0; i < primePowers[0].powers.length; i++) {
  let power = primePowers[0].powers[i];
  let number = power.primePower;
  let balance = {
    num: power.sumOfFactors,
    den: number
  };
  if (checkBalance(balance)) {
    answers.push(multiplyFactors(number));
    console.log(multiplyFactors(number).toString());
    continue;
  }
  let limits = {'2': power.primePower['2'] - 1};
  let primesUsed = [2];
  console.log(printAnswers() + '; ' + printFactors(number) + ': ' + printBalance(balance));
  findAnswers(number, balance, limits, primesUsed);
}

function findAnswers(number, balance, limits, primesUsed) {
  let pu = primesUsed.slice();
  let availablePrimes = Object.keys(balance.num);
  for (let i = 0; i < availablePrimes.length; i++) {
    let p = +availablePrimes[i];
    if (pu.indexOf(p) !== -1) {
      continue;
    }
    pu.push(p); // we're "using" primes here even if they're being skipped over
    let powerList = primePowers.find((e) => {
      return e.prime === p;
    }).powers;
    for (let j = 0; j < powerList.length; j++) {
      let power = powerList[j];
      if (multiplyFactors(number).multiply(multiplyFactors(power.primePower)).greaterThan(N)) {
        break;
      }
      if (!checkLimits(power, limits)) {
        continue;
      }
      let newNumber = NumberTheory.factorProduct([number, power.primePower]);
      let incomingBalance = {
        num: power.sumOfFactors,
        den: power.primePower
      };
      let newBalance = addBalances(balance, incomingBalance);
      console.log(printAnswers() + '; ' + printFactors(newNumber) + ': ' + printBalance(newBalance));
      if (checkBalance(newBalance)) {
        answers.push(multiplyFactors(newNumber));
        console.log(multiplyFactors(newNumber).toString());
        continue;
      }
      let newLimits = {};
      for (let l = 0; l < Object.keys(limits).length; l++) {
        let lp = Object.keys(limits)[l];
        if (lp in power.sumOfFactors) {
          newLimits[lp] = limits[lp] - power.sumOfFactors[lp];
        }
      }
      findAnswers(newNumber, newBalance, newLimits, pu);
    }
  }
}

let answer = new LargeInteger(0);

for (let i = 0; i < answers.length; i++) {
  answer = answer.add(answers[i]);
}

console.log('Sum: ' + answer.toString());
