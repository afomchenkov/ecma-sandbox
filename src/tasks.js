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

// TODO: recap
// function findStringCombinationsNoOverlaps(s) {
//   if (s.length == 0) {
//     return combinations;
//   }

//   function _findCombinations(str, substring, combinations) {
//     if (str.length == 0) {
//       combinations.add([...substring]);
//       return;
//     }

//     for (let i = 0; i < str.length; i++) {
//       const sub = str.substring(0, i + 1);
//       substring.push(sub);
//       const next = str.substring(i + 1);
//       _findCombinations(next, substring, combinations);
//       substring.pop();
//     }
//   }

//   const combinations = new Set();
//   const substring = [];
//   _findCombinations(s, substring, combinations);

//   return [...combinations];
// }

// TODO: recap
// const dijkstra = (edges, start_node, end_node) => {
//   let g = new Map(); // <string, { weight, end }[]>

//   for (const [start, end, weight] of edges) {
//     if (g.has(start)) {
//       g.get(start).push([weight, end]);
//     } else {
//       g.set(start, [[weight, end]]);
//     }
//   }

//   const q = [[0, start_node, []]]; // min_heap[weight, node, [adjacent nodes]]
//   const visited = new Set();

//   while (q.length) {
//     let [cost, v1, path] = q.pop(); // take next min weight path

//     if (!visited.has(v1)) {
//       visited.add(v1);

//       path = [v1, path];
//       if (v1 === end_node) {
//         return [cost, path];
//       }

//       for (const [c, v2] of g.get(v1) || []) {
//         if (!visited.has(v2)) {
//           q.push([cost + c, v2, path]);
//           q.sort((a, b) => {
//             const [weightA] = a;
//             const [weightB] = b;
//             return weightA < weightB;
//           });
//         }
//       }
//     }
//   }

//   return [];
// };

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

// TODO: recap
// function getUniqueSubstr(str) {
//   let n = str.length;
//   let window = {};
//   let start = 0;
//   let end = 0;

//   for (let left = 0, right = 0; right < n; ++right) {
//     if (window[str[right]]) {
//       while (str[left] != str[right]) {
//         window[str[left++]] = false;
//       }
//       left++;
//     } else {
//       window[str[right]] = true;
//       if (end - start < right - left) {
//         start = left;
//         end = right;
//       }
//     }
//   }

//   return str.substr(start, end - start + 1);
// };

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