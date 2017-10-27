let graph = {};
let start = 'orbbrrbbrrbbrrbb';
let end = 'obrbbrbrrbrbbrbr';

function oPosition(s) {
  return s.indexOf('o');
}

function L(s) {
  if (s === null) {
    return null;
  }
  let o = oPosition(s);
  if (o === 3 || o === 7 || o === 11 || o === 15) {
    return null;
  }
  let a = s.split('');
  a[o] = a[o + 1];
  a[o + 1] = 'o';
  return a.join('');
}

function R(s) {
  if (s === null) {
    return null;
  }
  let o = oPosition(s);
  if (o === 0 || o === 4 || o === 8 || o === 12) {
    return null;
  }
  let a = s.split('');
  a[o] = a[o - 1];
  a[o - 1] = 'o';
  return a.join('');
}

function U(s) {
  if (s === null) {
    return null;
  }
  let o = oPosition(s);
  if (o === 12 || o === 13 || o === 14 || o === 15) {
    return null;
  }
  let a = s.split('');
  a[o] = a[o + 4];
  a[o + 4] = 'o';
  return a.join('');
}

function D(s) {
  if (s === null) {
    return null;
  }
  let o = oPosition(s);
  if (o === 0 || o === 1 || o === 2 || o === 3) {
    return null;
  }
  let a = s.split('');
  a[o] = a[o - 4];
  a[o - 4] = 'o';
  return a.join('');
}

function setupGraph() {
  let q = [start];
  while (q.length > 0) {
    let s = q.shift();
    if (s in graph) {
      continue;
    }
    let d = D(s);
    let u = U(s);
    let l = L(s);
    let r = R(s);
    graph[s] = {
      L: l,
      R: r,
      U: u,
      D: d,
      paths: []
    };
    if (d !== null) {
      q.push(d);
    }
    if (u !== null) {
      q.push(u);
    }
    if (l !== null) {
      q.push(l);
    }
    if (r !== null) {
      q.push(r);
    }
  }
}

function concatWithoutDuplicates(a, b) {
  b.forEach((e) => {
    if (newA.indexOf(e) === -1) {
      newA.push(e);
    }
  });
}

function pathsFrom(s) {
  let paths = graph[s].paths;
  console.log(paths);
  let pathLength = paths[0].length;

  let l = graph[s].L;
  if (l !== null) {
    if (graph[l].paths.length === 0 || graph[l].paths[0].length >= pathLength + 1) {
      let newPaths = paths.map((e) => {return e + 'L';});
      if (graph[l].paths.length !== 0 && graph[l].paths[0].length === pathLength + 1) {
        newPaths.forEach((e) => {
          if (graph[l].paths.indexOf(e) === -1) {
            graph[l].paths.push(e);
          }
        });
      } else {
        graph[l].paths = newPaths;
      }
    }
  }

  let r = graph[s].R;
  if (r !== null) {
    if (graph[r].paths.length === 0 || graph[r].paths[0].length >= pathLength + 1) {
      let newPaths = paths.map((e) => {return e + 'R';});
      if (graph[r].paths.length !== 0 && graph[r].paths[0].length === pathLength + 1) {
        newPaths.forEach((e) => {
          if (graph[r].paths.indexOf(e) === -1) {
            graph[r].paths.push(e);
          }
        });
      } else {
        graph[r].paths = newPaths;
      }
    }
  }

  let u = graph[s].U;
  if (u !== null) {
    if (graph[u].paths.length === 0 || graph[u].paths[0].length >= pathLength + 1) {
      let newPaths = paths.map((e) => {return e + 'U';});
      if (graph[u].paths.length !== 0 && graph[u].paths[0].length === pathLength + 1) {
        newPaths.forEach((e) => {
          if (graph[u].paths.indexOf(e) === -1) {
            graph[u].paths.push(e);
          }
        });
      } else {
        graph[u].paths = newPaths;
      }
    }
  }

  let d = graph[s].D;
  if (d !== null) {
    if (graph[d].paths.length === 0 || graph[d].paths[0].length >= pathLength + 1) {
      let newPaths = paths.map((e) => {return e + 'D';});
      if (graph[d].paths.length !== 0 && graph[d].paths[0].length === pathLength + 1) {
        newPaths.forEach((e) => {
          if (graph[d].paths.indexOf(e) === -1) {
            graph[d].paths.push(e);
          }
        });
      } else {
        graph[d].paths = newPaths;
      }
    }
  }
}

function computePaths() {
  graph[start].paths = [''];
  for (let p = 0;; p++) {
    let q = Object.keys(graph).filter((e) => {
      return graph[e].paths.length !== 0 && graph[e].paths[0].length === p;
    });
    if (q.length === 0) {
      return;
    }
    q.forEach((s) => {
      pathsFrom(s);
    });
  }
}

function computeChecksum(p) {
  let checksum = 0;
  for (let i = 0; i < p.length; i++) {
    let v = 0;
    if (p[i] === 'L') {
      v = 76;
    } else if (p[i] === 'R') {
      v = 82;
    } else if (p[i] === 'U') {
      v = 85;
    } else if (p[i] === 'D') {
      v = 68;
    }
    checksum = (checksum*243 + v) % 100000007;
  }
  return checksum;
}

function addUpChecksums(s) {
  let total = 0;
  for (let i = 0; i < graph[s].paths.length; i++) {
    total += computeChecksum(graph[s].paths[i]);
  }
  return total;
}

setupGraph();
computePaths();

console.log(addUpChecksums(end));
