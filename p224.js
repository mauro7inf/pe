let NumberTheory = require('./NumberTheory');

let N = process.argv[2];

let count = 0;
for (let c = 3; c < N/2; c += 2) {
  if (c % 8 === 5 || c % 8 === 7) {
    continue;
  }
  let mFactors = NumberTheory.factor((c - 1)/2);
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
  }
}
console.log('Total count: ' + count);
