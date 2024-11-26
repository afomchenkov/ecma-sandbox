// find first duplicate
function findDuplicate(arr) {
  const len = arr.length;
  arr.sort((a, b) => a - b);
  let res = -1;
  for (let i = 1; i < len; i++) {
    if (arr[i - 1] == arr[i]) {
      // return first duplicate
      return arr[i];
    }
  }
  return res;
}
// console.log(findDuplicate([3, 9, 4, 11, 8, 0, 45, 1, 2, 11]));

function generateSpiralMatrix(length) {
  let mid = parseInt(length / 2);
  let val = 1;
  let res = Array.from({ length }, _ => new Array(length));

  for (let start = 0; start < mid; start++) {
    let last = length - start - 1;

    for (let k = start; k < last; k++) {
      // fill top row
      res[start][k] = val++;
    }
    for (let k = start; k < last; k++) {
      // fill last column
      res[k][last] = val++;
    }
    for (let k = last; k > start; k--) {
      // fill bottom row
      res[last][k] = val++;
    }
    for (let k = last; k > start; k--) {
      // fill first column
      res[k][start] = val++;
    }
  }

  // fill the center
  if (length % 2 == 1) {
    res[mid][mid] = val;
  }

  return res;
}
// console.log(generateSpiralMatrix(5));

function intersectionArrays(nums1, nums2) {
  let len1 = nums1.length;
  let len2 = nums2.length;

  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const intersection = [];

  let i = j = 0;
  while (i < len1 && j < len2) {
    if (nums1[i] > nums2[j]) {
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      intersection.push(nums1[i]);
      i++;
      j++;
    }
  }

  return intersection;
}
// console.log(intersectionArrays([1, 3, 5, 11, 16], [45, 3, 22, 2, 89, 1]));

function mergeSortedArrays(nums1, nums2) {
  const len1 = nums1.length;
  const len2 = nums2.length;
  const newLength = len1 + len2 - 1;
  let p1 = len1 - 1;
  let p2 = len2 - 1;

  // two pointers solution
  // commonArr = [..............]
  //                  |
  //                  p
  // arr1      = [..............]
  //                         |
  //                         p1
  // arr2      = [..............]
  //                     |
  //                     p2
  
  for (let p = newLength; p >= 0; p--) {
    if (p2 < 0) {
      break;
    }
    if (p1 < 0 && nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1--];
    } else {
      nums1[p] = nums2[p2--];
    }
  }

  // let end = len1 + len2 - 1;
  // let end1 = len1 - 1;
  // let end2 = len2 - 1;
  // while (end2 >= 0) {
  //   if (end1 >= 0) {
  //     if (nums1[end1] > nums2[end2]) {
  //       nums1[end] = nums1[end1--];
  //     } else {
  //       nums1[end] = nums2[end2--];
  //     }
  //   } else {
  //     nums1[end] = nums2[end2--];
  //   }
  //   end--;
  // }

  return nums1;
}
// console.log(mergeSortedArrays(
//   [1, 3, 7, 99],
//   [2, 5, 15, 88, 101],
// ));

// move zeroes to the end
function moveZeroes(arr) {
  const length = arr.length;

  let p = 0;
  for (let i = 0; i < length; ++i) {
    if (arr[i] == 0) {
      continue;
    } else {
      arr[p] = arr[i];
      p++;
    }
  }

  for (;p < length; p++) {
    arr[p] = 0;
  }

  return arr;
}
// console.log(moveZeroes([1, 0, 4, 33, 5, 0, 9, 0]));

function treeZigzagLevelOrder(root) {
  let res = [];
  if (root == null) {
    return res;
  }

  let queue = [];
  queue.push(root);
  let r2l = false;

  while (!queue.length) {
    let size = queue.length;
    let list = [];

    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      list.push(node.val);

      // push next nodes to queue
      if (node.left) {
        queue.shift(node.left);
      }
      if (node.right) {
        queue.shift(node.right);
      }
    }

    if (r2l) {
      r2l = false;
      list.reverse();
    } else {
      r2l = true;
    }

    res.push(list);
  }

  return res;
}

function generateParenthesis(n) {
  const list = [];
  const maxLen = n * 2;

  function backtrack(str, open, close) {
    if (str.length == maxLen) {
      list.push(str);
      return;
    }

    if (open < n) {
      backtrack(str + '(', open + 1, close);
    }

    if (close < open) {
      backtrack(str + ')', open, close + 1);
    }
  }

  backtrack('', 0, 0);
  return list;
}

function islandsCount(grid) {
  let counter = 0;

  const dfs = (i, j) => {
    if (
      i >= 0 &&
      j >= 0 &&
      i < grid.length &&
      j < grid[i].length &&
      grid[i][j] === '1'
    ) {
      grid[i][j] = '0';
      dfs(i + 1, j); // top
      dfs(i, j + 1); // right
      dfs(i - 1, j); // bottom
      dfs(i, j - 1); // left
    }
  };

  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[i].length; j += 1) {
      if (grid[i][j] === '1') {
        counter += 1;
        dfs(i, j);
      }
    }
  }

  return counter;
}

function findClosestExitLeeAlgorithm(grid) {
  let N = grid.length;
  let M = grid[0].length;
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];
  const passed = Array.from({ length: N }, () => new Array(M).fill(0));
  const queue = [];
  queue.push([0, 0]);
  passed[0][0] = 1;

  while (queue.length) {
    let last = queue.unshift();
    let x = last[0];
    let y = last[1];

    if (x == N - 1 && y == M - 1) {
      return true;
    }

    for (let i = 0; i < 4; ++i) {
      let moveX = x + dx[i];
      let moveY = y + dy[i];

      if (
        moveX >= 0 &&
        moveX < N &&
        moveY >= 0 &&
        moveY < M &&
        grid[moveX][moveY] == '.' &&
        !passed[moveX][moveY]
      ) {
        passed[moveX][moveY] = 1;
        queue.push([moveX, moveY]);
      }
    }
  }

  return false;
}

function letterCombinations(digits) {
  const result = [];
  if (digits == null || digits.length == 0) {
    return result;
  }
  const mapping = [
    '0',
    '1',
    'abc',
    'def',
    'ghi',
    'jkl',
    'mno',
    'pqrs',
    'tuv',
    'wxyz',
  ];

  function letterCombinationsRecursive(current, index) {
    if (index == digits.length) {
      result.push(current);
      return;
    }

    const letters = mapping[digits.at(index) - '0'];
    for (let i = 0; i < letters.length; i++) {
      letterCombinationsRecursive(current + letters.at(i), index + 1);
    }
  }

  letterCombinationsRecursive('', 0);
  return result;
}
// console.log(letterCombinations('341'));

// bubble the result from the bottom up
function maxDepthBottomUp(root) {
  if (!root) {
    return 0;
  }

  let depthLeft = maxDepthBottomUp(root.left);
  let depthRight = maxDepthBottomUp(root.right);

  return Math.max(depthLeft, depthRight) + 1;
};

let maxDepthAnswer = 0;
// traverse the depth from root to leaves
function maxDepthTopDown(root, depth) {
  if (!root) {
    return;
  }

  if (!root.left && !root.right) {
    maxDepthAnswer = Math.max(maxDepthAnswer, depth);
  }

  maxDepthTopDown(root.left, depth + 1);
  maxDepthTopDown(root.right, depth + 1);
};

function generateSubsets1(nums) {
  const result = [];
  nums.sort((a, b) => a - b);

  function backtrack(list, temp, nums, start) {
    list.push([...temp]);

    for (let i = start; i < nums.length; ++i) {
      temp.push(nums[i]);
      backtrack(list, temp, nums, i + 1);
      temp.pop();
    }
  }
  backtrack(result, [], nums, 0);

  return result;
}

function generateSubsets2(arr) {
  const result = [];

  function backtrack(curr, i) {
    if (i == arr.length) {
      result.push([...curr]);
      return;
    }

    curr.push(arr[i]);
    backtrack(curr, i + 1);
    curr.pop();
    backtrack(curr, i + 1);
  }
  backtrack([], 0);

  return result;
}
// console.log(generateSubsets2([2, 1, 8]));

function permute(arr) {
  const result = [];
  const len = arr.length;

  function traverse(arr, curr) {
    if (curr.length === len) {
      result.push([...curr]);
      return;
    }

    for (let i = 0; i < arr.length; ++i) {
      const clone = [...arr];
      const next = clone.splice(i, 1);
      traverse(clone, curr.concat(next));
    }
  }
  traverse(arr, []);

  return result;
}
// console.log(permute([2, 1, 8]));

function combinationSumWithoutDuplicates(num, target) {
  let res = [];

  function dfs(num, start, current, sum, target) {
    if (sum == target) {
      res.push([...current]);
      return;
    }

    for (let i = start; i < num.length; i++) {
      if (i > start && num[i] == num[i - 1]) continue;
      if (num[i] + sum <= target) {
        list.push(num[i]);
        dfs(num, i + 1, list, sum + num[i], target);
        current.splice(current.length - 1);
      }
    }
  }

  num.sort((a, b) => a - b);
  dfs(num, 0, [], 0, target);
  return res;
}

const generateParenBacktracking = (n) => {
  const totalLength = 2 * n;
  const result = [];

  const backtrack = (curr, leftCount, rightCount) => {
    if (curr.length == totalLength) {
      result.push(curr.join(''));
    }

    // push left parenthesis
    if (leftCount < n) {
      curr.push('(');
      backtrack(curr, leftCount + 1, rightCount);
      curr.pop();
    }

    // push right parenthesis
    if (leftCount > rightCount) {
      curr.push(')');
      backtrack(curr, leftCount, rightCount + 1);
      curr.pop();
    }
  };

  backtrack([], 0, 0);
  return result;
};
// console.log('BT: ', generateParenBacktracking(3));

const dijkstra = (edges, startNode, endNode) => {
  let graph = new Map(); // <string, { weight, end }[]>

  // build the graph of start/end edges
  for (const [v1, v2, weight] of edges) {
    if (graph.has(v1)) {
      graph.get(v1).push({ weight, v2 });
    } else {
      graph.set(v1, [{ weight, v2 }]);
    }
  }

  const minHeap = [[0, startNode, []]]; // [weight, node, [adjacent nodes]]
  const visited = new Set();
  while (minHeap.length) {
    let [cost, v1, path] = minHeap.pop();

    if (!visited.has(v1)) {
      visited.add(v1);

      path = [...path, v1];
      // check if shortest reached
      if (v1 == endNode) {
        return [cost, path];
      }

      for (const nextNode of graph.get(v1) || []) {
        const { v2, weight } = nextNode;

        if (!visited.has(v2)) {
          minHeap.push([cost + weight, v2, path]);
          // relaxation, find min path so far
          minHeap.sort((a, b) => a[0] < b[0]);
          // we can also override Math.min(cost, cost + weight) to keep min path all the time
        }
      }
    }
  }

  return [];
}

const edges = [
  ['A', 'B', 7],
  ['A', 'D', 5],
  ['B', 'C', 8],
  ['B', 'D', 9],
  ['B', 'E', 7],
  ['C', 'E', 5],
  ['D', 'E', 7],
  ['D', 'F', 6],
  ['E', 'F', 8],
  ['E', 'G', 9],
  ['F', 'G', 11],
];

// path1 = A(7) -> B(8) -> C(5) -> E(9) -> G, total_weight = 29
// path2 = A(7) -> B(9) -> D(7) -> E(9) -> G, total_weight = 32
// path3 = A(7) -> B(7) -> E(9) -> G, total_weight = 23
// path4 = A(5) -> D(7) -> E(9) -> G, total_weight = 22

// console.log(JSON.stringify(dijkstra(edges, 'A', 'G')));

function findStringCombinationsNoOverlaps(s) {
  if (s.length == 0) {
    return combinations;
  }

  function _findCombinations(str, substring, combinations) {
    if (str.length == 0) {
      combinations.add([...substring]);
      return;
    }

    for (let i = 0; i < str.length; i++) {
      const sub = str.substring(0, i + 1);

      substring.push(sub);
      _findCombinations(str.substring(i + 1), substring, combinations);
      substring.pop();
    }
  }

  const combinations = new Set();
  const substring = [];
  _findCombinations(s, substring, combinations);

  return [...combinations];
}
// console.log(findStringCombinationsNoOverlaps("aads"));

function insertInterval(intervals, newInterval) {
  let res = [];
  let i = 0;

  for (; i < intervals.length; i++) {
    const currentInterval = intervals[i];

    // Edge case 1: stop when i-th interval is greater and no intersection with a newInterval
    if (newInterval[1] < currentInterval[0]) {
      res.push(newInterval);
      break;
    }

    // Edge case 2: if i-th interval is less than a newInterval, push result
    if (currentInterval[1] < newInterval[0]) {
      res.push(currentInterval);
      continue;
    }

    // merge newInterval left-right
    newInterval[0] = Math.min(currentInterval[0], newInterval[0]);
    newInterval[1] = Math.max(currentInterval[1], newInterval[1]);
  }

  // if new interval at the very end
  if (i == intervals.length) {
    res.push(newInterval);
  }

  // fill the rest of the intervals
  while (i < intervals.length) {
    res.push(intervals[i++]);
  }

  return res;
}

/**
 * Sliding window, example:
 * --------------------------------------------- 0
 * str = "hsdkfhsdlpncdvd"
 *        |
 * left = 0, right = 0, longest = (start = 0, end = 0)
 * { h: 1 }
 * --------------------------------------------- 1
 * str = "hsdkfhsdlpncdvd"
 *        ||
 * left = 0, right = 1, longest = (start = 0, end = 1)
 * { h: 1, s: 1 }
 * --------------------------------------------- 2
 * str = "hsdkfhsdlpncdvd"
 *        | |
 * left = 0, right = 2, longest = (start = 0, end = 2)
 * { h: 1, s: 1, d: 1 }
 * --------------------------------------------- 3
 * str = "hsdkfhsdlpncdvd"
 *        |  |
 * left = 0, right = 3, longest = (start = 0, end = 3)
 * { h: 1, s: 1, d: 1, k: 1 }
 * --------------------------------------------- 4
 * str = "hsdkfhsdlpncdvd"
 *        |   |
 * left = 0, right = 4, longest = (start = 0, end = 4)
 * { h: 1, s: 1, d: 1, k: 1, f: 1 }
 * --------------------------------------------- 5
 * str = "hsdkfhsdlpncdvd"
 *        |    |
 * [[duplicate character]] -> move left pointer till next duplicate + 1
 * 
 * str = "hsdkfhsdlpncdvd"
 *         |   |
 * left = 1, right = 5, longest = (start = 0, end = 4)
 * { h: 1, s: 1, d: 1, k: 1, f: 1 }
 * --------------------------------------------- 6
 * str = "hsdkfhsdlpncdvd"
 *         |    |
 * [[duplicate character]] -> move left pointer till next duplicate + 1
 * 
 * str = "hsdkfhsdlpncdvd"
 *          |   |
 * left = 2, right = 6, longest = (start = 0, end = 5)
 * { h: 1, s: 1, d: 1, k: 1, f: 1 }
 * --------------------------------------------- 7
 * str = "hsdkfhsdlpncdvd"
 *          |    |
 * [[duplicate character]] -> move left pointer till next duplicate + 1
 * 
 * str = "hsdkfhsdlpncdvd"
 *           |   |
 * left = 3, right = 7, longest = (start = 0, end = 5)
 * { h: 1, s: 1, d: 1, k: 1, f: 1 }
 * --------------------------------------------- 8
 * str = "hsdkfhsdlpncdvd"
 *           |    |
 * left = 3, right = 8, longest = (start = 3, end = 8)
 * { h: 1, s: 1, d: 1, k: 1, f: 1, l: 1 }
 * --------------------------------------------- 9
 * str = "hsdkfhsdlpncdvd"
 *           |     |
 * left = 3, right = 9, longest = (start = 3, end = 9)
 * { h: 1, s: 1, d: 1, k: 1, f: 1, l: 1, p: 1 }
 * --------------------------------------------- 10
 * str = "hsdkfhsdlpncdvd"
 *           |      |
 * left = 3, right = 10, longest = (start = 3, end = 10)
 * { h: 1, s: 1, d: 1, k: 1, f: 1, l: 1, p: 1, n: 1 }
 * --------------------------------------------- 11
 * str = "hsdkfhsdlpncdvd"
 *           |       |
 * left = 3, right = 11, longest = (start = 3, end = 11)
 * { h: 1, s: 1, d: 1, k: 1, f: 1, l: 1, p: 1, n: 1, c: 1 }
 * --------------------------------------------- 12
 * str = "hsdkfhsdlpncdvd"
 *            |       |
 * [[duplicate character]] -> move left pointer till next duplicate + 1
 * str = "hsdkfhsdlpncdvd"
 *                |   |
 * left = 8, right = 12, longest = (start = 3, end = 11)
 * rest dict till next duplicate occurrence + 1
 * { h: 0, s: 0, d: 1, k: 0, f: 0, l: 1, p: 1, n: 1, c: 1 }
 * --------------------------------------------- 13
 * str = "hsdkfhsdlpncdvd"
 *                |    |
 * left = 8, right = 13, longest = (start = 3, end = 11)
 * { h: 0, s: 0, d: 1, k: 0, f: 0, l: 1, p: 1, n: 1, c: 1, v: 1 }
 * --------------------------------------------- 14
 * 
 * ..... and so on
 * 
 * @param {*} str 
 * @returns 
 */
function getLongestUniqueSubstr(str = "") {
  let n = str.length;
  let window = {};
  let start = 0;
  let end = 0;

  for (let left = 0, right = 0; right < n; ++right) {
    let rightChar = str.charAt(right);
    // once we meet a duplicate, shift left pointer till we find next char occurrence + 1
    if (window[rightChar]) {
      while (str.charAt(left) != rightChar) {
        window[str.charAt(left++)] = 0;
      }
      left++;
    } else {
      window[rightChar] = 1;
      // set max distance for unique substring
      if (end - start < right - left) {
        start = left;
        end = right;
      }
    }
  }

  return str.substr(start, end - start + 1);
};
// console.log('Unique substr: ', getLongestUniqueSubstr('hsdkfhsdlpncdvd'));
