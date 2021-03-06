let primes = [];
let primeLimit = 1;
let primeLimitMultiplier = 2;

// returns a list of primes up to n
function getPrimesUpTo(n) {
  console.log('generating primes up to ' + n);
  // naive way
  primes = [];
  let sieve = [];
  for (let i = 0; i <= n; i++) {
    sieve[i] = false;
  }
  for (let currentPrime = 2; currentPrime <= n; currentPrime++) {
    if (sieve[currentPrime]) {
      continue;
    }
    primes.push(currentPrime);
    for (let j = currentPrime*currentPrime; j <= n; j += currentPrime) {
      sieve[j] = true;
    }
  }
  primeLimit = n;
  return primes;
}

// returns the nth prime, where prime 1 is 2
function nthPrime(n) {
  while (primes.length < n) {
    getPrimesUpTo(primeLimit*primeLimitMultiplier);
  }
  return primes[n - 1];
}

// object where the keys are primes and the values are exponents
function factor(a) {
  return factorHelper(a, false);
}

function isPrime(a) {
  return factorHelper(a, true);
}

// test is boolean; if true, this function simply tests primality
function factorHelper(a, test) {
  let n;
  if (typeof a === 'object') {
    let keys = Object.keys(a);
    if (test) {
      return (keys.length === 1);
    }
    let f = {}; // make shallow copy
    for (let i = 0; i < keys.length; i++) {
      f[keys[i]] = a[keys[i]];
    }
    return f;
  } else {
    n = +a;
  }
  let factors = {};
  let currentPrimeIndex = 1;
  let r = n; // reduced n
  let currentPrime = nthPrime(currentPrimeIndex);
  while (currentPrime*currentPrime <= r) {
    if (r % currentPrime === 0) {
      if (test) {
        return false;
      }
      if (currentPrime in factors) {
        factors[currentPrime]++;
      } else {
        factors[currentPrime] = 1;
      }
      r /= currentPrime;
    } else {
      currentPrimeIndex++;
      currentPrime = nthPrime(currentPrimeIndex);
    }
  }
  if (r > 1) {
    if (test) {
      return true;
    }
    if (r in factors) {
      factors[r]++;
    } else {
      factors[r] = 1;
    }
  }
  if (test) {
    return false;
  }
  return factors;
}

// factor a product of array of numbers
function factorProduct(a) {
  let factors = factor(a[0]);
  for (let i = 1; i < a.length; i++) {
    let newFactors = factor(a[i]);
    let pFactors = primeFactors(newFactors);
    for (let j = 0; j < pFactors.length; j++) {
      if (pFactors[j] in factors) {
        factors[pFactors[j]] += newFactors[pFactors[j]];
      } else {
        factors[pFactors[j]] = newFactors[pFactors[j]];
      }
    }
  }
  return factors;
}

// factor a/b, where b is ideally a factor of a
function factorQuotient(a, b) {
    let factors = factor(a);
    let bFactors = factor(b);
    let pFactors = primeFactors(b);
    for (let i = 0; i < pFactors.length; i++) {
        if (pFactors[i] in factors) {
            factors[pFactors[i]] -= bFactors[pFactors[i]];
        } else {
            factors[pFactors[i]] = -bFactors[pFactors[i]]; // bad
        }
    }
    return factors;
}

// array of prime factors
// a can be either a number or an object of factors
function primeFactors(a) {
  let factors = null;
  if (typeof a === 'number' || typeof a === 'string') {
    factors = factor(+a);
  } else if (typeof a === 'object') {
    factors = a;
  }
  return Object.keys(factors).map(n => +n);
}

// array of arrays with factor pairs; accepts a factored number or a number
function factorPairs(a) {
  let factors = null;
  if (typeof a === 'number' || typeof a === 'string') {
    factors = factor(+a);
    n = +a;
  } else if (typeof a === 'object') {
    factors = a;
    n = multiplyFactors(a);
  }
  let pFactors = primeFactors(factors);
  let pairs = [];
  let nPrimes = pFactors.length;
  let currentFactor = [];
  for (let i = 0; i < nPrimes; i++) {
    currentFactor[i] = 0;
  }

  function computeCurrentFactor() {
    let f = 1;
    for (let i = 0; i < nPrimes; i++) {
      let p = pFactors[i];
      for (let j = 0; j < currentFactor[i]; j++) {
        f = f*p;
      }
    }
    return f;
  }

  function incrementCurrentFactor() {
    let c = 0;
    while (c < nPrimes) {
      currentFactor[c]++;
      let f = computeCurrentFactor();
      if (currentFactor[c] > factors[pFactors[c]] || f > n/f) {
        currentFactor[c] = 0;
        c++;
      } else {
        return;
      }
    }
    currentFactor = null;
  }

  while (currentFactor) {
    let f = computeCurrentFactor();
    pairs.push([f, n/f]);
    incrementCurrentFactor();
  }

  return pairs;
}

// unique sets of factors
function factorSets(a) {
  return factorSetsWithSmallestFactor(a, 1);
}

// internal function
function factorSetsWithSmallestFactor(a, f) {
  let sets = [];
  let pairs = factorPairs(a);
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i][0] < f) {
      continue;
    }
    if (pairs[i][0] === 1) {
      sets.push([pairs[i][1]]);
      continue;
    }
    sets.push(pairs[i]);
    let remainderSets = factorSetsWithSmallestFactor(pairs[i][1], pairs[i][0]);
    for (let j = 0; j < remainderSets.length; j++) {
      sets.push([pairs[i][0]].concat(remainderSets[j]));
    }
  }
  return sets;
}

// multiply factors back together
function multiplyFactors(a) {
  let pFactors = primeFactors(a);
  let total = 1;
  for (let i = 0; i < pFactors.length; i++) {
    for (let j = 0; j < a[pFactors[i]]; j++) {
      total *= pFactors[i];
    }
  }
  return total;
}

// boolean if a (number or factored number) can be written
// as sum of two positive squares
function canBeSumOfTwoSquares(a) {
  let factors = factor(a);
  let pFactors = primeFactors(factors);
  let oddTwos = false;
  let pythagoreanPrimes = false;
  for (let i = 0; i < pFactors.length; i++) {
    let pType = pFactors[i] % 4;
    if (pType === 3 && factors[pFactors[i]] % 2 === 1) {
      return false;
    } else if (pType === 2 && factors[pFactors[i]] % 2 === 1) {
      oddTwos = true;
    } else if (pType === 1) {
      pythagoreanPrimes = true;
    }
  }
  return oddTwos || pythagoreanPrimes;
}

// gcd by Euclidean algorithm
function gcd(a, b) {
  let ar = a;
  let br = b;
  let r = ar % br;
  while (r !== 0) {
    ar = br;
    br = r;
    r = ar % br;
  }
  return br;
}

function lcm(a, b) {
  return a*b/gcd(a, b);
}

function totient(a) {
  let pFactors = primeFactors(a);
  let f;
  if (typeof a === 'object') {
    f = multiplyFactors(a);
  } else {
    f = a;
  }
  for (let i = 0; i < pFactors.length; i++) {
    let p = pFactors[i];
    f = (f/p)*(p - 1);
  }
  return f;
}

function carmichael(a) {
  let factors = factor(a);
  let pFactors = primeFactors(factors);
  let result;
  if (pFactors.length === 1 && pFactors[0] === 2 && factors[2] > 2) {
    result = totient(a)/2;
  } else if (pFactors.length === 1 || (pFactors.length === 2 && pFactors[0] === 2)) {
    result = totient(a);
  } else {
    let cms = [];
    for (let i = 0; i < pFactors.length; i++) {
      let p = pFactors[i];
      let pp = {};
      pp[p] = factors[p];
      cms.push(carmichael(pp));
    }
    while (cms.length > 1) {
      reducedCms = [];
      for (let i = 0; i < cms.length; i += 2) {
        if (i === cms.length - 1) {
          reducedCms.push(cms[i]);
        } else {
          reducedCms.push(lcm(cms[i], cms[i + 1]));
        }
      }
      cms = reducedCms;
    }
    result = cms[0];
  }
  return result;
}

// takes a number
function digitSum(a) {
  let n = a;
  let sum = 0;
  while (n > 0) {
    let d = n % 10;
    sum += d;
    n = (n - d)/10;
  }
  return sum;
};

// takes a number
function digitCount(a) {
  if (a === 0) {
    return 1; // special case
  }
  let n = a;
  let count = 0;
  while (n > 0) {
    let d = n % 10;
    count += 1;
    n = (n - d)/10;
  }
  return count;
};

function numberOfFactors(a) {
  let factors = factor(a);
  let pFactors = primeFactors(factors);
  let total = 1;
  for (let i = 0; i < pFactors.length; i++) {
    total *= factors[pFactors[i]] + 1;
  }
  return total;
}

function sumOfFactors(a) {
  let factors = factor(a);
  let pFactors = primeFactors(factors);
  let total = 1;
  for (let i = 0; i < pFactors.length; i++) {
    let p = pFactors[i];
    let num = Math.pow(p, factors[p] + 1) - 1;
    let den = p - 1;
    total *= num/den;
  }
  return total;
}

module.exports = {
  getPrimesUpTo: getPrimesUpTo,
  nthPrime: nthPrime,
  factor: factor,
  multiplyFactors: multiplyFactors,
  isPrime: isPrime,
  factorProduct: factorProduct,
  factorQuotient: factorQuotient,
  primeFactors: primeFactors,
  factorPairs: factorPairs,
  factorSets: factorSets,
  canBeSumOfTwoSquares: canBeSumOfTwoSquares,
  gcd: gcd,
  lcm: lcm,
  totient: totient,
  carmichael: carmichael,
  digitSum: digitSum,
  digitCount: digitCount,
  numberOfFactors: numberOfFactors,
  sumOfFactors: sumOfFactors
};
