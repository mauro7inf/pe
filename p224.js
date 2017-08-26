let NumberTheory = require('./NumberTheory');

let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

// memoized list of decompositions of numbers into two squares
let decompositions = {}
decompositions[1] = [[0, 1]];
decompositions[2] = [[1, 1]];

function squaresForPrime(p) {
  debug('squaresForPrime ' + p);
  // assumes p is prime
  if (p in decompositions) {
    return decompositions[p];
  }
  if (p % 4 === 3) {
    return [];
  }
  for (let a = 1; 2*a*a <= p; a++) {
    let b = Math.sqrt(p - a*a);
    if (b === Math.floor(b)) {
      decompositions[p] = [[a, b]];
      return decompositions[p];
    }
  }
  // shouldn't be the case
  decompositions[p] = [];
  return [];
}

function squaresForPrimePower(p, e) {
  debug('squaresForPrimePower ' + p + '^' + e);
  // assumes p is prime and 4n + 1
  // if p is 2 or 4n + 3, deal with it directly
  if (e === 1) {
    return squaresForPrime(p);
  }
  let b = Math.pow(p, e);
  if (b in decompositions) {
    return decompositions[b];
  }
  squaresForPrimePower(p, e - 1); // make sure it's built
  return squaresForProduct(p, Math.pow(p, e - 1));
}

function squaresForProduct(m, n) {
  debug('squaresForProduct ' + m + '·' + n);
  // assumes both m and n are already memoized
  if (m*n in decompositions) {
    return decompositions[m*n];
  }
  let mSquares = decompositions[m];
  let nSquares = decompositions[n];
  debug('mSquares: ' + mSquares);
  debug('nSquares: ' + nSquares);
  let mnSquares = [];
  for (let i = 0; i < mSquares.length; i++) {
    let a = mSquares[i][0];
    let b = mSquares[i][1];
    for (let j = 0; j < nSquares.length; j++) {
      let c = nSquares[j][0];
      let d = nSquares[j][1];

      let bg1a = a*c + b*d;
      let bg1b = a*d - b*c;
      if (bg1b < 0) {
        bg1b *= -1;
      }
      let bg1 = (bg1a > bg1b) ? [bg1b, bg1a] : [bg1a, bg1b]; // Brahmagupta's identity
      
      let bg2a = a*c - b*d;
      if (bg2a < 0) {
        bg2a *= -1;
      }
      let bg2b = a*d + b*c;
      let bg2 = (bg2a > bg2b) ? [bg2b, bg2a] : [bg2a, bg2b];

      let found1 = false;
      for (let k = 0; k < mnSquares.length; k++) {
        if (bg1[0] === mnSquares[k][0]) {
          found1 = true;
          break;
        }
      }
      if (!found1) {
        mnSquares.push(bg1);
      }

      let found2 = false;
      for (let k = 0; k < mnSquares.length; k++) {
        if (bg2[0] === mnSquares[k][0]) {
          found2 = true;
          break;
        }
      }
      if (!found2) {
        mnSquares.push(bg2);
      }
    }
  }
  decompositions[m*n] = mnSquares;
  return mnSquares;
}

// array of numbers
function squaresForNumber(a) {
  debug('squaresForNumber ' + a);
  let n = 1;
  for (let i = 0; i < a.length; i++) {
    n *= a[i];
  }
  if (n in decompositions) { // will only happen for n without 4n + 3 primes or powers of 2 greater than 1
    return decompositions[n];
  }
  let factors = NumberTheory.factorProduct(a);
  let pFactors = NumberTheory.primeFactors(factors);
  let odd2 = false;
  let pythagoreanPrimeFactors = false;
  let commonFactor = 1;
  let cumulativeFactors = 1;
  // first do a pFactors pass to make sure it's even possible and round up common factors
  for (let i = 0; i < pFactors.length; i++) {
    let p = pFactors[i];
    let e = factors[p];
    if (p === 2) {
      if (e % 2 === 1) {
        odd2 = true;
        cumulativeFactors = 2;
        commonFactor *= Math.pow(2, (e - 1)/2);
      } else {
        commonFactor *= Math.pow(2, e/2);
      }
    } else if (p % 4 === 3) {
      if (e % 2 === 1) {
        return [];
      } else {
        commonFactor *= Math.pow(p, e/2);
      }
    } else if (p % 4 === 1) {
      pythagoreanPrimeFactors = true;
    }
  }
  if (!odd2 && !pythagoreanPrimeFactors) {
    return [];
  }

  for (let i = 0; i < pFactors.length; i++) {
    let p = pFactors[i];
    let e = factors[p];
    if (p % 4 === 1) {
      squaresForPrimePower(p, e); // generate the thing
      let b = Math.pow(p, e);
      squaresForProduct(cumulativeFactors, b);
      cumulativeFactors *= b;
    }
  }
  let squarefreeSquares = squaresForNumber([cumulativeFactors]);
  let squares = [];
  for (let i = 0; i < squarefreeSquares.length; i++) {
    squares.push([commonFactor*squarefreeSquares[i][0], commonFactor*squarefreeSquares[i][1]]);
  }
  return squares;
}

let count = 0;
for (let c = 3; c < N/2; c += 2) {
  if (c % 8 === 5 || c % 8 === 7) {
    continue;
  }
 debug('c = ' + c);
  let squares = squaresForNumber([(c - 1)/2, (c + 1)/2]);
  debug(decompositions);
  for (let i = 0; i < squares.length; i++) {
    if (squares[i][0] === 0) {
      continue;
    } else if (2*squares[i][0] + 2*squares[i][1] + c > N) {
      continue;
    } else {
      count++;
      //console.log('a = ' + 2*squares[i][0] + ', b = ' + 2*squares[i][1] + ', c = ' + c + ', count = ' + count);
      if (count % 1000 === 0) {
        console.log('count = ' + count + ' (c = ' + c + ')');
      }
    }
  }


  /*let mFactors = NumberTheory.factor((c - 1)/2);
  let nFactors = NumberTheory.factor((c + 1)/2);
  let totalFactors = NumberTheory.factorProduct([mFactors, nFactors]);
  if (NumberTheory.canBeSumOfTwoSquares(totalFactors)) {
    let sum = ((c - 1)*(c + 1))/4;
    let aResidues;
    if (sum % 20 === 0) {
      aResidues = [0, 2, 4, 6, 8];
    } else if (sum % 20 === 2) {
      aResidues = [1, 9];
    } else if (sum % 20 === 6) {
      aResidues = [1, 5, 9];
    } else if (sum % 20 === 10) {
      aResidues = [1, 3, 5, 7, 9];
    } else if (sum % 20 === 12) {
      aResidues = [4, 6];
    } else if (sum % 20 === 16) {
      aResidues = [0, 4, 6];
    }
    let aMax = Math.sqrt(sum/2);
    for (let aTens = 0; 200*aTens*aTens <= sum; aTens++) {
      for (let aOnesIndex = 0; aOnesIndex < aResidues.length; aOnesIndex++) {
        let aOnes = aResidues[aOnesIndex];
        let a = 10*aTens + aOnes;
        if (a === 0) {
          continue;
        }
        if (a > aMax) {
          break;
        }
        let b = Math.sqrt(sum - (a*a));
        if (2*a + 2*b + c > N) {
          break;
        }
        if (b === Math.floor(b)) {
          count++;
          //console.log('a = ' + 2*a + ', b = ' + 2*b + ', c = ' + c + ', count = ' + count);
          if (count % 1000 === 0) {
            console.log('count = ' + count + ' (c = ' + c + ')');
          }
        }
      }
    }
  }*/
}
console.log('Total count: ' + count);
