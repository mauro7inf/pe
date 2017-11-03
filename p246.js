let Polynomial = require('./Polynomial');

let Mx = +(process.argv[2]);
let My = +(process.argv[3]);
let Gx = +(process.argv[4]);
let Gy = +(process.argv[5]);
let R = +(process.argv[6]);
let REDUCTION = +(process.argv[7]);
let ANGLE = +(process.argv[8]);

let dxm = new Polynomial([
  {
    coefficient: 1,
    variables: {
      x: 1
    }
  },
  {
    coefficient: -1,
    variables: {
      mx: 1
    }
  }
]);

let dym = new Polynomial([
  {
    coefficient: 1,
    variables: {
      y: 1
    }
  },
  {
    coefficient: -1,
    variables: {
      my: 1
    }
  }
]);

let squareDistanceM = dxm.multiply(dxm).add(dym.multiply(dym));

let dxg = new Polynomial([
  {
    coefficient: 1,
    variables: {
      x: 1
    }
  },
  {
    coefficient: -1,
    variables: {
      gx: 1
    }
  }
]);

let dyg = new Polynomial([
  {
    coefficient: 1,
    variables: {
      y: 1
    }
  },
  {
    coefficient: -1,
    variables: {
      gy: 1
    }
  }
]);

let squareDistanceG = dxg.multiply(dxg).add(dyg.multiply(dyg));

let r2 = new Polynomial([
  {
    coefficient: 1,
    variables: {
      r: 2
    }
  }
]);

let lh = r2.add(squareDistanceM).subtract(squareDistanceG);
let lhs = lh.multiply(lh);
let rhs = r2.multiply(4).multiply(squareDistanceM);
let eqn = lhs.subtract(rhs);

function substitute(poly) {
  return poly
    .substitute('my', My)
    .substitute('gy', Gy)
    .substitute('mx', Mx)
    .substitute('gx', Gx)
    .multiply(1/REDUCTION)
    .substitute('r', R)
    ;
}

let sub = substitute(eqn);
console.log('Ellipse: ' + substitute(eqn).toString() + ' = 0');

let grouped = eqn.group('x', 'y');
let ACoeff = grouped.coefficient({variables: {x: 2}});
let BCoeff = grouped.coefficient({variables: {x: 1, y: 1}});
let CCoeff = grouped.coefficient({variables: {y: 2}});
let DCoeff = grouped.coefficient({variables: {x: 1}});
let ECoeff = grouped.coefficient({variables: {y: 1}});
let FCoeff = grouped.coefficient({variables: {}});

let reduction = new Polynomial([
  {
    coefficient: 1/32,
    variables: {
      r: -2
    }
  }
]);

let centerXNum = BCoeff.multiply(ECoeff).subtract(CCoeff.multiply(DCoeff).multiply(2)).multiply(reduction);
let centerYNum = BCoeff.multiply(DCoeff).subtract(ACoeff.multiply(ECoeff).multiply(2)).multiply(reduction);
let centerDen = ACoeff.multiply(CCoeff).multiply(4).subtract(BCoeff.multiply(BCoeff)).multiply(reduction);

let centerX = +(substitute(centerXNum).toString())/+(substitute(centerDen).toString());
let centerY = +(substitute(centerYNum).toString())/+(substitute(centerDen).toString());

// x = centerX + a cos(t)
// y = centerY + c cos(t) + d sin(t)

let xPara = new Polynomial([
  {
    coefficient: 1,
    variables: {
      a: 1,
      cos: 1
    }
  },
  {
    coefficient: centerX,
    variables: {}
  }
]);

let yPara = new Polynomial([
  {
    coefficient: 1,
    variables: {
      c: 1,
      cos: 1
    }
  },
  {
    coefficient: 1,
    variables: {
      d: 1,
      sin: 1
    }
  },
  {
    coefficient: centerY,
    variables: {}
  }
]);

let trigEqn = substitute(eqn.substitute('x', xPara).substitute('y', yPara)).group('sin', 'cos');

console.log('Parametrized: ' + trigEqn.multiply(-1).toString() + ' = 0');

let cos2Coeff = trigEqn.coefficient({variables: {cos: 2}});
let sin2Coeff = trigEqn.coefficient({variables: {sin: 2}});
let sinCosCoeff = trigEqn.coefficient({variables: {sin: 1, cos: 1}});
let constantCoeff = trigEqn.coefficient({variables: {}});

let dInv = new Polynomial([
  {
    coefficient: 1,
    variables: {
      d: -1
    }
  }
]);

let eqn2 = sinCosCoeff.multiply(-1).multiply(dInv);
let eqn3 = constantCoeff.add(sin2Coeff).multiply(-1);

let d2 = -(eqn3.coefficient({variables: {}}).toString())/+(eqn3.coefficient({variables: {d: 2}}).toString());
let d = Math.sqrt(d2);

let aCoeff = +eqn2.coefficient({variables: {a: 1}}).toString();
let cCoeff = +eqn2.coefficient({variables: {c: 1}}).toString();
let cInTermsOfA = new Polynomial([
  {
    coefficient: -aCoeff/cCoeff,
    variables: {
      'a': 1
    }
  }
]);

let protoEqn1 = cos2Coeff.subtract(sin2Coeff).multiply(-1).substitute('c', cInTermsOfA);
let d2Term = protoEqn1.term({variables: {d: 2}});
let d2Coeff = protoEqn1.coefficient({variables: {d: 2}});
let eqn1 = protoEqn1.subtract(d2Term).add(d2Coeff.multiply(d2));

let a2 = -(eqn1.coefficient({variables: {}}).toString())/+(eqn1.coefficient({variables: {a: 2}}).toString());
let a = Math.sqrt(a2);
let c = (-aCoeff/cCoeff)*a;

let centerXString = centerX === 0 ? '' : '' + centerX + ' + ';
let centerYString = centerY === 0 ? '' : '' + centerY + ' + ';
let cString = c === 0 ? '' : '' + c + '·cos(t) + ';

console.log('x = ' + centerXString + a + '·cos(t)');
console.log('y = ' + centerYString + cString + d + '·sin(t)');

function cosAngle(x, y) {
  let xp = (x - centerX)/a;
  let yp = ((y - centerY) - c*xp)/d;
  let r2 = xp*xp + yp*yp;

  let cos0 = (1/r2)*(xp - yp*Math.sqrt(r2 - 1));
  let sin0 = (1/r2)*(yp + xp*Math.sqrt(r2 - 1));
  let cos1 = (1/r2)*(xp + yp*Math.sqrt(r2 - 1));
  let sin1 = (1/r2)*(yp - xp*Math.sqrt(r2 - 1));
  let v0x = centerX + a*cos0 - x;
  let v0y = centerY + c*cos0 + d*sin0 - y;
  let v1x = centerX + a*cos1 - x;
  let v1y = centerY + c*cos1 + d*sin1 - y;
  let dot = v0x*v1x + v0y*v1y;
  let v0 = Math.sqrt(v0x*v0x + v0y*v0y);
  let v1 = Math.sqrt(v1x*v1x + v1y*v1y);
  return dot/(v0*v1);
}

let cosCutoff = Math.cos(ANGLE*Math.PI/180);

let total = 0;
let x0 = Math.floor(centerX);
let y0 = Math.floor(centerY);

function getColumn(x, hint) {
  let column = {};

  let y = hint.upperTop;
  let last = cosAngle(x, y);
  if (last >= cosCutoff) {
    while (last >= cosCutoff) {
      if (y < hint.lowerBottom) { // assuming that can't happen
        return null;
      }
      y--;
      last = cosAngle(x, y);
    }
    column.upperTop = y;
  } else {
    while (last < cosCutoff) {
      y++;
      last = cosAngle(x, y);
    }
    column.upperTop = y - 1;
  }

  y = hint.lowerBottom;
  last = cosAngle(x, y);
  if (last >= cosCutoff) {
    while (last >= cosCutoff) {
      y++;
      last = cosAngle(x, y);
    }
    column.lowerBottom = y;
  } else {
    while (last < cosCutoff) {
      y--;
      last = cosAngle(x, y);
    }
    column.lowerBottom = y + 1;
  }

  if ('upperBottom' in hint) {
    y = hint.upperBottom;
    last = cosAngle(x, y);
    if (last < cosCutoff) {
      while (last < cosCutoff) {
        y--;
        last = cosAngle(x, y);
      }
      if (isNaN(last)) { // if not, we no longer have a NaN hole
        column.upperBottom = y + 1;
      }
    } else if (isNaN(last)) {
      while (isNaN(last)) {
        y++;
        last = cosAngle(x, y);
      }
      column.upperBottom = y;
    }

    y = hint.lowerTop;
    last = cosAngle(x, y);
    if (last < cosCutoff) {
      while (last < cosCutoff) {
        y++;
        last = cosAngle(x, y);
      }
      if (isNaN(last)) {
        column.lowerTop = y - 1;
      }
    } else if (isNaN(last)) {
      while (isNaN(last)) {
        y--;
        last = cosAngle(x, y);
      }
      column.lowerTop = y;
    }
  }

  return column;
}

function computeColumn(column) {
  if (column === null) {
    return 0;
  }
  if ('upperBottom' in column) {
    return (column.upperTop - column.upperBottom + 1) + (column.lowerTop - column.lowerBottom + 1);
  } else {
    return (column.upperTop - column.lowerBottom + 1);
  }
}

function printColumn(column) {
  if (column === null) {
    return 'Ø';
  }
  let s = '[' + column.lowerBottom + ', ';
  if ('lowerTop' in column) {
    s += column.lowerTop + '], [' + column.upperBottom + ', ';
  }
  s += column.upperTop + ']';
  return s;
}

let middleColumn = {};
let last = NaN;
for (let y = y0;; y++) {
  let ca = cosAngle(x0, y);
  if (isNaN(last) && ca < cosCutoff) {
    middleColumn.upperBottom = y;
  }
  if (ca >= cosCutoff && last < cosCutoff) {
    middleColumn.upperTop = y;
    break;
  }
  last = ca;
}
last = NaN;
for (let y = y0;; y--) {
  let ca = cosAngle(x0, y);
  if (isNaN(last) && ca < cosCutoff) {
    middleColumn.lowerTop = y;
  }
  if (ca >= cosCutoff && last < cosCutoff) {
    middleColumn.lowerBottom = y;
    break;
  }
  last = ca;
}

console.log('x = ' + x0 + ': ' + printColumn(middleColumn));
total += computeColumn(middleColumn);
let forwardColumn = middleColumn;
let forwardX = x0;
while (forwardColumn) {
  forwardX++;
  forwardColumn = getColumn(forwardX, forwardColumn);
  console.log('x = ' + forwardX + ': ' + printColumn(forwardColumn));
  total += computeColumn(forwardColumn);
}
let backwardColumn = middleColumn;
let backwardX = x0;
while (backwardColumn) {
  backwardX--;
  backwardColumn = getColumn(backwardX, backwardColumn);
  console.log('x = ' + backwardX + ': ' + printColumn(backwardColumn));
  total += computeColumn(backwardColumn);
}

console.log(total);
