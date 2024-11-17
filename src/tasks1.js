function generateSubsets(arr) {
  let len = arr.length;
  let result = [];

  function generate(curr, idx) {
    if (idx == len) {
      result.push([...curr]);
      return;
    }

    curr.push(arr[idx]);
    generate(curr, idx + 1);
    curr.pop();
    generate(curr, idx + 1);
  }
  generate([], 0);

  return result;
}

function subsetsBacktrack(arr) {
  let result = [];
  let len = arr.length;

  function backtrack(curr, i) {
    result.push([...curr]);

    for (let j = i; j < len; ++j) {
      curr.push(arr[j]);
      backtrack(curr, j + 1);
      curr.pop();
    }
  }
  backtrack([], 0);
  return result;
}
// console.log('Subsets: ', subsetsBacktrack([2, 1, 1]));

// the collection can have duplicates [2, 1, 1, 9, 4, 9]
// generate subsets without duplicate subsets
function subsetsWithDuplicates(nums) {
  let len = nums.length;
  let result = [];

  nums.sort((a, b) => a - b);

  function backtrack(curr, i) {
    result.push([...curr]);

    for (let j = i; j < len; ++j) {
      // check if duplicate, continue
      if (j != i && nums[j - 1] == nums[j]) {
        continue;
      }

      curr.push(nums[j]);
      backtrack(curr, j + 1);
      curr.pop();
    }
  }
  backtrack([], 0);

  return result;
}
// console.log('Subsets without duplicates: ', subsetsWithDuplicates([2, 1, 1]));

function permute(nums) {
  let result = [];
  let len = nums.length;

  function _permute(n, curr) {
    if (curr.length == len) {
      result.push([...curr]);
      return;
    }

    for (let i = 0; i < n.length; ++i) {
      const clone = [...n];
      const next = clone.splice(i, 1);
      _permute(clone, curr.concat(next));
    }
  }
  _permute(nums, []);

  return result;
}
// console.log('Permute: ', permute([2, 1, 1]));

function permuteUnique(nums) {
  let result = [];
  let len = nums.length;
  // count number occurrences
  let counter = new Map();

  for (let num of nums) {
    if (!counter.has(num)) {
      counter.set(num, 0);
    }
    counter.set(num, counter.get(num) + 1);
  }

  function backtrack(curr) {
    if (curr.length == len) {
      result.push([...curr]);
      return;
    }

    for (let [num, count] of counter.entries()) {
      if (count == 0) {
        continue;
      }

      curr.push(num);
      counter.set(num, count - 1);
      backtrack(curr);
      curr.pop();
      counter.set(num, count);
    }
  }
  backtrack([]);

  return result;
}
// console.log('Permute without duplicates: ', permuteUnique([2, 1, 1]));

function longestUniqueSubstring(str) {
  let len = str.length;
  let window = {};
  let start = 0;
  let end = 0;

  for (let left = 0, right = 0; right < len; right++) {
    let char = str.charAt(right);

    // encountered duplicate [... left ... right ...]
    if (window[char]) {
      while (str[left] != str[right]) {
        window[str[left++]] = false;
      }
      left++;
    } else {
      window[char] = true;
      if (end - start < right - left) {
        start = left;
        end = right;
      }
    }
  }

  return str.substr(start, end - start + 1);
}
let strHere = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb';

function dijkstra(edges, start, end) {
  const graph = new Map();

  for (const [from, to, weight] of edges) {
    if (graph.has(from)) {
      graph.get(from).push({ to, weight });
    } else {
      graph.set(from, [{ to, weight }]);
    }
  }

  let visited = new Set();
  let heap = [[0, [], start]]; // weight, path, node

  while (heap.length) {
    let [w, path, v1] = heap.pop();

    if (!visited.has(v1)) {
      visited.add(v1);

      path = [path, v1];
      if (v1 == end) {
        return [w, path];
      }

      for (const { to, weight } of graph.get(v1) || []) {
        if (!visited.has(to)) {
          heap.push([w + weight, path, to]);
          heap.sort((a, b) => a[1] < b[1]);
        }
      }
    }
  }

  return [];
}

function findIslands(grid) {
  let rows = grid.length;
  let cols = grid[0].length;
  let islandsCount = 0;

  function dfs(i, j, grid) {
    if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] == '1') {
      return;
    }

    grid[i][j] = '0';

    dfs(i + 1, j, grid);
    dfs(i - 1, j, grid);
    dfs(i, j + 1, grid);
    dfs(i, j - 1, grid);
  }

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      if (grid[i][j] == '1') {
        dfs(i, j, grid);
        islandsCount++;
      }
    }
  }

  return islandsCount;
}

function getNextChar(char = 'a') {
  if (char === 'z') return 'a';
  return String.fromCharCode(char.charCodeAt(0) + 1);
}
