class TreeNode {
  constructor(x) {
    this.val = x;
    this.left = null;
    this.right = null;
  }
}

class ListNode {
  constructor(x) {
    this.val = x;
    this.next = null;
  }
}

// Implement a trie with insert, search, and startsWith methods.
// You may assume that all inputs are consist of lowercase letters a-z.
//
// Trie trie = new Trie();
// trie.insert("somestring");
// trie.search("key");
class TrieNode {
  constructor(character) {
    this.map = new Map();
    this.character = character;
    this.last = false;
  }
}

class Trie {
  #root;

  constructor() {
    this.#root = new TrieNode(" ");
  }

  insert(word) {
    let current = this.#root;

    for (let c of word.split("")) {
      if (!current.map.has(c)) {
        current.map.set(c, new TrieNode(c));
      }
      current = current.map.get(c);
    }
    current.last = true;
  }

  search(word) {
    let current = this.#root;

    for (let c of word.split("")) {
      if (!current.map.has(c)) {
        return false;
      }
      current = current.map.get(c);
    }
    return current.last;
  }

  startsWith(prefix) {
    let current = this.#root;

    for (let c of prefix.split("")) {
      if (!current.map.has(c)) {
        return false;
      }
      current = current.map.get(c);
    }
    return true;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let str = "leetcode";
let coll = ["leet", "code"];
function wordBreak(str, items) {
  let n = str.length;
  let dp = []; // new Array(n).fill(false);
  dp[0] = true;

  for (let i = 1; i <= n; ++i) {
    for (let j = 0; j < i; ++j) {
      let substr = str.substr(j, i - j);
      if (dp[j] && items.find((v) => v === substr)) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[n] || false;
}
// console.log('1 ', wordBreak(str, coll));

let arr = [1, 2, 3];
function generateSubsets(arr) {
  let result = [];

  const traverse = (result, nums, path, position) => {
    if (position >= nums.length) {
      result.push([...path]);
      return;
    }

    path.push(nums[position]);
    traverse(result, nums, path, position + 1);

    path.pop();
    traverse(result, nums, path, position + 1);
  };

  traverse(result, arr, [], 0);
  return result;
}
// console.log('2 ', generateSubsets(arr));

function findAddToSum(arr, sum) {
  const indexes = [];
  const dict = new Map();
  const n = arr.length;

  for (let i = 0; i < n; ++i) {
    const val = arr[i];
    const diff = sum - val;

    if (!dict.has(diff)) {
      dict.set(val, i);
    } else {
      const opp = dict.get(diff);

      indexes.push(opp);
      indexes.push(i);
      break;
    }
  }

  return indexes;
}
// console.log('3 ', findAddToSum([1, 4, 12, 5, 4], 8));

// sliding window
function longestSubstWithoutRepeat(s) {
  let chars = new Array(128).fill(0);
  let left = 0;
  let right = 0;
  let res = 0;

  while (right < s.length) {
    let r = s.charCodeAt(right);
    chars[r]++;

    while (chars[r] > 1) {
      let l = s.charCodeAt(left);
      chars[l]--;
      left++;
    }

    res = Math.max(res, right - left + 1);
    right++;
  }

  return res;
}
// console.log('4 ', longestSubstWithoutRepeat('wpwklepl;kjdfg')); // 'epl;kjdfg'

function minIncrArrIncreasing(arr) {
  const n = arr.length;
  const diff = new Array(n - 1);

  for (let i = 1; i < n; ++i) {
    const prev = arr[i - 1];
    const curr = arr[i];

    if (curr > prev) {
      diff[i - 1] = curr - prev;
    } else {
      diff[i - 1] = Infinity;
    }
  }

  return Math.min(...diff);
}
// console.log('5 ', minIncrArrIncreasing([3, 1, 2, 1]));

function findShortestPath(config) {
  const { rows, columns, startPosition, maze } = config;

  let minDist = Infinity,
    counter = 0,
    result = [],
    intraverse = [];
  const scores = Array.from({ length: rows }, (_) =>
    Array.from({ length: columns }, (_) => counter++)
  );
  const visited = Array.from({ length: rows }, (_) =>
    new Array(columns).fill(0)
  );

  const isValid = (x, y) => x < rows && y < columns && x >= 0 && y >= 0;
  const isSafe = (x, y) => !(maze[x][y] === "#" || visited[x][y]);

  const source = { x: 0, y: maze[0].findIndex((z) => z === " ") };
  const dest = { x: rows - 1, y: maze[rows - 1].findIndex((d) => d === "d") };

  if (dest.y < 0) {
    return;
  }

  const traverseShortest = (startX, startY, dist) => {
    const distNext = dist + 1;
    // get to the exit
    if (startX === dest.x && startY === dest.y) {
      if (distNext < minDist) {
        minDist = distNext;
        // push the last point
        intraverse.push(scores[startX][startY]);
        result = intraverse;
      }
      intraverse = [];
      return;
    }

    visited[startX][startY] = 1;
    intraverse.push(scores[startX][startY]);

    const moveUp = startX + 1;
    if (isValid(moveUp, startY) && isSafe(moveUp, startY)) {
      traverseShortest(moveUp, startY, distNext);
    }
    const moveRight = startY + 1;
    if (isValid(startX, moveRight) && isSafe(startX, moveRight)) {
      traverseShortest(startX, moveRight, distNext);
    }
    const moveDown = startX - 1;
    if (isValid(moveDown, startY) && isSafe(moveDown, startY)) {
      traverseShortest(moveDown, startY, distNext);
    }
    const moveLeft = startY - 1;
    if (isValid(startX, moveLeft) && isSafe(startX, moveLeft)) {
      traverseShortest(startX, moveLeft, distNext);
    }

    // backtrack
    visited[startX][startY] = 0;
    intraverse.pop();
  };

  traverseShortest(source.x, source.y, 0);
  return minDist != Infinity ? result : undefined;
}

const maze = [
  ["#", "#", "#", " ", "#", "#"],
  ["#", " ", " ", " ", " ", " "],
  ["#", " ", "#", " ", "#", " "],
  ["#", " ", " ", " ", "#", " "],
  ["#", "#", "#", "#", " ", " "],
  ["#", "#", "#", " ", " ", "#"],
  ["#", "#", "#", " ", "#", "#"],
  ["#", "#", "d", " ", "#", "#"],
];
const rows = maze.length;
const columns = maze[0].length;
const startPosition = 1;

// console.log('6 ', findShortestPath({ rows, columns, startPosition, maze }));
// [3, 9, 10, 11, 17, 23, 29, 28, 34, 33, 39, 45, 44]

function longestPalindromicSubstr(str) {
  if (str == null || str.length == 0) {
    return "";
  }

  function isPalindrome(str) {
    let left = 0;
    let right = str.length - 1;
    while (left <= right) {
      if (str[left] != str[right]) {
        return false;
      }

      left++;
      right--;
    }
    return true;
  }

  let longestPalindromicSubstring = "";
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      let substr = str.substring(i, j);
      if (j - i > longestPalindromicSubstring.length && isPalindrome(substr)) {
        longestPalindromicSubstring = substr;
      }
    }
  }

  return longestPalindromicSubstring;
}
// console.log('7 ', longestPalindromicSubstr('wbabad'));

function isValidBST(root) {
  if (root == null) {
    return true;
  }

  function validBSTRecursive(root, minValue, maxValue) {
    if (root == null) {
      return true;
    } else if (root.val >= maxValue || root.val <= minValue) {
      return false;
    } else {
      return (
        validBSTRecursive(root.left, minValue, root.val) &&
        validBSTRecursive(root.right, root.val, maxValue)
      );
    }
  }

  return validBSTRecursive(root, -Infinity, Infinity);
}
// console.log('8 ', isValidBST(null));

function letterCombinations(digits) {
  let result = [];

  if (digits == null || digits.length == 0) {
    return result;
  }

  const mapping = [
    "0",
    "1",
    "abc",
    "def",
    "ghi",
    "jkl",
    "mno",
    "pqrs",
    "tuv",
    "wxyz",
  ];

  function letterCombinationsRecursive(
    result,
    digits,
    current,
    index,
    mapping
  ) {
    if (index == digits.length) {
      result.push(current);
      return;
    }

    let letters = mapping[digits.at(index) - "0"];
    for (let i = 0; i < letters.length; i++) {
      letterCombinationsRecursive(
        result,
        digits,
        current + letters.at(i),
        index + 1,
        mapping
      );
    }
  }

  letterCombinationsRecursive(result, digits, "", 0, mapping);

  return result;
}
// console.log('9 ', letterCombinations(null));

// For example, given: ["eat", "tea", "tan", "ate", "nat", "bat"],
// Return:
// [
//   ["ate", "eat","tea"],
//   ["nat","tan"],
//   ["bat"]
// ]
function groupAnagrams(strs = []) {
  if (strs == null || strs.length == 0) {
    return [];
  }

  const map = {};
  strs.sort();

  for (let s of strs) {
    let characters = s.split("");
    characters.sort();

    let key = characters.join("");

    if (!map[key]) {
      map[key] = [];
    }

    map[key].push(s);
  }

  return [Object.values(map)];
}
// console.log('10 ', groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));

function levelOrder(root) {
  const result = [];

  if (root == null) {
    return result;
  }

  const queue = [];
  queue.push(root);

  const tempList = [];
  tempList.push(root.val);
  result.push(tempList);

  while (!queue.length) {
    const currentLevel = [];
    let list = [];

    while (!queue.length) {
      let current = queue.pop();

      if (current.left != null) {
        currentLevel.push(current.left);
        list.push(current.left.val);
      }

      if (current.right != null) {
        currentLevel.push(current.right);
        list.push(current.right.val);
      }
    }

    if (list.length > 0) {
      result.push(list);
    }

    queue = currentLevel;
  }

  return result;
}
// console.log('11 ', levelOrder(null));

function permutator(inputArr) {
  let result = [];

  function permute(arr, m = []) {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = [...arr]; // make copy
        let next = curr.splice(i, 1); // get last item

        permute(curr, m.concat(next));
      }
    }
  }

  permute(inputArr);

  return result;
}
// console.log('12 ', permutator([1, 2, 4]));

function permutations(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i++) {
    let inter = xs.slice(0, i).concat(xs.slice(i + 1));
    let rest = permutations(inter);

    if (!rest.length) {
      ret.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j++) {
        ret.push([xs[i]].concat(rest[j]));
      }
    }
  }

  return ret;
}
// console.log('13 ', permutations([1, 2, 4]));

// "abc"
// 'a' + "bc"
// 'b' + "ac"
// 'c' + "ab"
function findPermutations(string) {
  if (!string || typeof string !== "string") {
    return "Please enter a string";
  } else if (string.length < 2) {
    return string;
  }

  let permutationsArray = [];

  for (let i = 0; i < string.length; i++) {
    let char = string[i];

    if (string.indexOf(char) != i) continue;

    let remainingChars =
      string.slice(0, i) + string.slice(i + 1, string.length);
    const permsWithoutCurr = findPermutations(remainingChars);

    for (let permutation of permsWithoutCurr) {
      permutationsArray.push(char + permutation);
    }
  }
  return permutationsArray;
}
// console.log('14 ', findPermutations('123'));

function letterCombinations(digits) {
  // Return early if no digits were supplied
  if (!digits.length) {
    return [];
  }

  function getLetterCombinations(digits, previousCombinations) {
    // Initialise an array to store the possibilties for this digit
    let newPossibilities = [];

    // Loop through the previous iteration's combinations
    for (let previousCombination of previousCombinations) {
      // Loop through the possible letters for this number
      for (let possibleLetter of mapOfNumbers[digits[0]]) {
        // Add a combination of the previous set with the current letters to the array
        newPossibilities.push(previousCombination.concat(possibleLetter));
      }
    }

    // If there are more digits, run the function again, otherwise return the combinations
    return digits.length > 1
      ? getLetterCombinations(digits.slice(1), newPossibilities)
      : newPossibilities;
  }

  return getLetterCombinations(digits.toString(), [""]);
}
// console.log('15 ', letterCombinations('123'));

var mapOfNumbers = {
  2: ["a", "b", "c"],
  3: ["d", "e", "f"],
  4: ["g", "h", "i"],
  5: ["j", "k", "l"],
  6: ["m", "n", "o"],
  7: ["p", "q", "r", "s"],
  8: ["t", "u", "v"],
  9: ["w", "x", "y", "z"],
};

function numIslands(grid) {
  let counter = 0;

  const dfs = (i, j) => {
    if (
      i >= 0 &&
      j >= 0 &&
      i < grid.length &&
      j < grid[i].length &&
      grid[i][j] === "1"
    ) {
      grid[i][j] = "0";
      dfs(i + 1, j); // top
      dfs(i, j + 1); // right
      dfs(i - 1, j); // bottom
      dfs(i, j - 1); // left
    }
  };

  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[i].length; j += 1) {
      if (grid[i][j] === "1") {
        counter += 1;
        dfs(i, j);
      }
    }
  }

  return counter;
}
// console.log('16 ', numIslands());

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function fillRiddle(riddle) {
  const riddleArr = riddle.split("");
  const n = riddleArr.length;
  const getNextRandom = (notIn) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const getRandom = (_) => Math.floor(Math.random() * chars.length - 1);
    let randomValidChar = "";
    notIn = notIn.filter((n) => n != "?");

    while (true) {
      const c = chars[getRandom()];
      if (!notIn.includes(c)) {
        randomValidChar = c;
        break;
      }
    }
    return randomValidChar;
  };

  for (let i = 0; i < n; i++) {
    const prevIdx = i - 1;
    const nextIdx = i + 1;

    if (prevIdx < 0) {
      // first char
      if (riddleArr[i] == "?") {
        riddleArr[i] = getNextRandom([riddleArr[nextIdx]]); // next can be '?'
      }
    }
    if (prevIdx >= 0 && nextIdx < n) {
      if (riddleArr[i] == "?") {
        riddleArr[i] = getNextRandom([riddleArr[prevIdx], riddleArr[nextIdx]]); // prev always present, next can be '?'
      }
    }
    if (nextIdx > n - 1) {
      // last char
      if (riddleArr[i] == "?") {
        riddleArr[i] = getNextRandom([riddleArr[prevIdx]]); // prev always present
      }
    }
  }

  return riddleArr.join("");
}
// console.log('17 ', fillRiddle('rd?e?wg?'));

// Given a non-negative integer num, repeatedly add all its digits until the result has only one digit.
// Given num = 38, the process is like: 3 + 8 = 11, 1 + 1 = 2. Since 2 has only one digit, return it.
function addDigits(num) {
  while (num >= 10) {
    let temp = 0;
    while (num > 0) {
      temp += num % 10;
      num /= 10;
    }
    num = temp;
  }

  return num;
}
// console.log('18 ', addDigits(32));

// You are given two non-empty linked lists representing two non-negative integers.
// The digits are stored in reverse order and each of their nodes contain a single digit.
// Add the two numbers and return it as a linked list.
// Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
// Output: 7 -> 0 -> 8
function addTwoNumbers(l1, l2) {
  let current1 = l1;
  let current2 = l2;
  let head = new ListNode(0);
  let currentHead = head;

  let sum = 0;

  while (current1 != null || current2 != null) {
    sum /= 10;
    if (current1 != null) {
      sum += current1.val;
      current1 = current1.next;
    }

    if (current2 != null) {
      sum += current2.val;
      current2 = current2.next;
    }

    currentHead.next = new ListNode(sum % 10);
    currentHead = currentHead.next;
  }

  if (sum / 10 == 1) {
    currentHead.next = new ListNode(1);
  }

  return head.next;
}
// console.log('19 ', addTwoNumbers(null));

// Given an array of integers and an integer k, find out whether there are two distinct indices i and
// j in the array such that nums[i] = nums[j] and the absolute difference between i and j is at most k.
function containsNearbyDuplicate(nums, k) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    let current = nums[i];
    if (map.has(current) && i - map.get(current) <= k) {
      return true;
    } else {
      map.put(current, i);
    }
  }

  return false;
}
// console.log('20 ', containsNearbyDuplicate(null));

function sortedArrayToBST(nums) {
  if (nums.length == 0) {
    return null;
  }

  function helper(nums, start, end) {
    if (start <= end) {
      let mid = (start + end) / 2;
      let current = new TreeNode(nums[mid]);
      current.left = helper(nums, start, mid - 1);
      current.right = helper(nums, mid + 1, end);
      return current;
    }

    return null;
  }

  const root = helper(nums, 0, nums.length - 1);
  return root;
}
// console.log('21 ', sortedArrayToBST(null));

// Given a list of non-negative integers representing the amount of money of each house,
// determine the maximum amount of money you can rob tonight without alerting the police (cannot jump on adjacent houses).
function rob(nums) {
  if (nums.length == 0) {
    return 0;
  }
  if (nums.length == 1) {
    return nums[0];
  }

  const dp = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = nums[0] > nums[1] ? nums[0] : nums[1];

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }

  return dp[dp.length - 1];
}
// console.log('22 ', rob(null));

// Implement regular expression matching with support for '.' and '*'.
// '.' Matches any single character.
// '*' Matches zero or more of the preceding element.
//
// isMatch("aa","a") → false
// isMatch("aa","aa") → true
// isMatch("aaa","aa") → false
// isMatch("aa", "a*") → true
// isMatch("aa", ".*") → true
// isMatch("ab", ".*") → true
// isMatch("aab", "c*a*b") → true
function isMatch(s, p) {
  if (s == null || p == null) {
    return false;
  }

  const dp = new Array(s.length + 1).fill(new Array(p.length + 1));
  dp[0][0] = true;

  for (let i = 0; i < p.length; i++) {
    if (p.at(i) == "*" && dp[0][i - 1]) {
      dp[0][i + 1] = true;
    }
  }

  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < p.length; j++) {
      if (p.at(j) == ".") {
        dp[i + 1][j + 1] = dp[i][j];
      }
      if (p.at(j) == s.at(i)) {
        dp[i + 1][j + 1] = dp[i][j];
      }
      if (p.at(j) == "*") {
        if (p.at(j - 1) != s.at(i) && p.at(j - 1) != ".") {
          dp[i + 1][j + 1] = dp[i + 1][j - 1];
        } else {
          dp[i + 1][j + 1] = dp[i + 1][j] || dp[i][j + 1] || dp[i + 1][j - 1];
        }
      }
    }
  }

  return dp[s.length][p.length];
}
// console.log('23 ', isMatch(null));

/**
 * Given an array of integers, the cost to change an element is the absolute difference between it's
 * initial value and it's new value. E.g. if element is initially 10, it can be changed to 7 or 13
 * for a cost of 3. Determine the minimum cost to sort the array either ascending or descending along
 * it's length.
 *
 * arr = [0, 1, 2, 3, 4, 6, 5, 7]
 * min_cost = 1 => [0, 1, 2, 3, 4, 6, 6, 7]
 */
function minCostMakeAscDesc(arr) {
  function findMinCost(arr) {
    let n = arr.length;
    const u = [...arr];
    u.sort((a, b) => a - b);
    let N = 0;

    for (let i = 0; i < n; i++) {
      if (i == 0 || u[i - 1] < u[i]) {
        u[N++] = u[i];
      }
    }

    const dp = new Array(N).fill(0);
    for (let i = 0; i < n; i++) {
      let opt = Infinity;

      for (let j = 0; j < N; j++) {
        opt = Math.min(opt, dp[j]);
        dp[j] = opt + Math.abs(arr[i] - u[j]);
      }
    }

    let opt = Infinity;
    for (let j = 0; j < N; j++) {
      opt = Math.min(opt, dp[j]);
    }

    return opt;
  }

  if (arr.length <= 2) {
    return 0;
  }

  let ret = findMinCost(arr);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = -arr[i];
  }

  return Math.min(ret, findMinCost(arr));
}
// console.log('24 ', minCostMakeAscDesc([0, 1, 2, 3, 4, 5, 9, 7]));

function fibDp(n) {
  let a = 1;
  let b = 1;
  let c = 0;

  function dp(n) {
    let dp = [];
    dp[1] = 1;
    dp[2] = 1;
    for (let i = 3; i <= n; ++i) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
  }

  if (n == 1 || n == 2) {
    return 1;
  }
  for (let i = 3; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  return c;
}
// console.log('25 ', fibDp(5));

// There are N stations in a route, starting from 0 to N - 1. A train moves from the first station 0 to
// the last station N - 1 in only forward direction. The cost of ticket between any two stations is given.
// Find the min cost of travel from station 0 to station N - 1
let rootPathCost = [
  [0, 10, 75, 94],
  [-1, 0, 35, 50],
  [-1, -1, 0, 80],
  [-1, -1, -1, 0],
];
// cost[i][j] is cost of ticket from station i to station j
// we are not moving forward, hence i > j => -1
function findMinCostRoot(cost, s, d) {
  function calculateMinCost(s, d) {
    if (s == d || s == d - 1) {
      return cost[s][d];
    }
    let minCost = cost[s][d];

    for (let i = s + 1; i < d; ++i) {
      // min cost of going from s to i and min cost from i to d
      let tmp = calculateMinCost(s, i) + calculateMinCost(i, d);
      if (tmp < minCost) {
        minCost = tmp;
      }
      return minCost;
    }
  }

  // dp - cache (optimal substructure)
  // dp[s][d] - min cost to travel from station s to station d
  // let n = cost.length;
  // let dp = new Array(n).fill(new Array(n).fill(0));
  function calculateMinCostCache(s, d) {
    if (s == d || s == d - 1) {
      return cost[s][d];
    }
    if (dp[s][d] == 0) {
      let minCost = cost[s][d];
      for (let i = s + 1; i < d; ++i) {
        // min cost of going from s to i directly and min cost from i to d
        let tmp = calculateMinCost(s, i) + calculateMinCost(i, d);
        if (tmp < minCost) {
          minCost = tmp;
        }
        dp[s][d] = minCost;
      }
      return dp[s][d];
    }
  }

  function calculateMinCostDP(cost) {
    let n = cost.length;
    let minCost = []; // minCost[i] = min cost from station-0 to station-i
    minCost[0] = 0;
    minCost[1] = cost[0][1];

    for (let i = 2; i < n; ++i) {
      minCost[i] = cost[0][i];
      for (let j = 1; j < i; ++j) {
        let tmp = minCost[j] + cost[i][j];
        if (minCost[i] > tmp) {
          minCost[i] = tmp;
        }
      }
    }

    return minCost[n - 1];
  }

  return calculateMinCost(s, d);
}
// console.log('26 ', findMinCostRoot(rootPathCost, 0, rootPathCost.length - 1));

// Given an array S of n integers, are there elements a, b, c in S such that a + b + c = 0?
// Find all unique triplets in the array which gives the sum of zero.
// Given array S = [-1, 0, 1, 2, -1, -4],
// A solution set is:
// [
//   [-1, 0, 1],
//   [-1, -1, 2]
// ]
function threeSum(nums) {
  let n = nums.length;
  let result = new Array(n);
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) {
      continue;
    }

    let j = i + 1;
    let k = nums.length - 1;
    let target = -nums[i];
    while (j < k) {
      if (nums[j] + nums[k] == target) {
        let temp = new Array();
        temp.add(nums[i]);
        temp.add(nums[j]);
        temp.add(nums[k]);
        result.add(temp);

        j++;
        k--;
        while (j < k && nums[j] == nums[j - 1]) {
          j++;
        }
        while (j < k && nums[k] == nums[k + 1]) {
          k--;
        }
      } else if (nums[j] + nums[k] > target) {
        k--;
      } else {
        j++;
      }
    }
  }

  return result;
}
// console.log('27 ', threeSum([0, 5, 9, 7]));

// Say you have an array for which the ith element is the price of a given stock on day i.
// If you were only permitted to complete at most one transaction (ie, buy one and sell one share
// of the stock), design an algorithm to find the maximum profit.
//
// Input: [7, 1, 5, 3, 6, 4]
// Output: 5
// max. difference = 6 - 1 = 5
function maxProfit(prices) {
  // Kadane's algorithm
  if (prices.length == 0) {
    return 0;
  }

  let max = 0;
  let min = prices[0];

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > min) {
      max = Math.max(max, prices[i] - min);
    } else {
      min = prices[i];
    }
  }

  return max;
}
// console.log('28 ', maxProfit([0, 5, 9, 7]));

function hasListCycle(head) {
  if (head == null || head.next == null) {
    return false;
  }

  let slow = head;
  let fast = head.next;
  while (fast != null && fast.next != null && fast != slow) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return fast == slow;
}
// console.log('29 ', hasListCycle(null));

function lowestCommonAncestor(root, p, q) {
  if (root == null || root == p || root == q) {
    return root;
  }

  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);

  if (left != null && right != null) {
    return root;
  }

  return left == null ? right : left;
}
// console.log('30 ', lowestCommonAncestor(null));

function isPalindromeList(head) {
  if (head == null || head.next == null) {
    return true;
  }

  let stack = [];
  let fast = head;
  let slow = head;
  while (fast != null && fast.next != null) {
    stack.push(slow.val);
    fast = fast.next.next;
    slow = slow.next;
  }

  if (fast != null) {
    slow = slow.next;
  }

  while (slow != null) {
    if (stack.pop() != slow.val) {
      return false;
    }

    slow = slow.next;
  }

  return true;
}
// console.log('31 ', isPalindromeList(null));

function rotate(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < i; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length / 2; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[i][matrix[0].length - 1 - j];
      matrix[i][matrix[0].length - 1 - j] = temp;
    }
  }
}
// console.log('32 ', rotate(null));

// Given n non-negative integers representing an elevation map where the width of each bar is 1,
// compute how much water it is able to trap after raining.
// Given [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], return 6.
function trap(height) {
  let water = 0;

  let leftIndex = 0;
  let rightIndex = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;

  while (leftIndex <= rightIndex) {
    leftMax = Math.max(leftMax, height[leftIndex]);
    rightMax = Math.max(rightMax, height[rightIndex]);

    if (leftMax < rightMax) {
      water += leftMax - height[leftIndex];
      leftIndex++;
    } else {
      water += rightMax - height[rightIndex];
      rightIndex--;
    }
  }

  return water;
}
// console.log('33 ', trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));

function kadane(arr) {
  let n = arr.length;
  let maxSoFar = Infinity;
  let maxEndingHere = 0;

  for (let i = 1; i < n; i++) {
    maxEndingHere = Math.max(maxEndingHere + arr[i], arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
// console.log('34 ', kadane([0, 3, 2, 1, 2, 1]));

// Find the length of longest substring of a given string of digits, such that sum
// of digits in the first half and second half of the string is the same.
// '142124' -> 6 (1 + 4 + 2 = 1 + 2 + 4)
function maxSubstrnigLengthDP(str) {
  let n = str.length;
  // sum[i][j] = sum of digits from i to j
  // if i > j - no meaning for value
  let sum = new Array(n).fill([]);
  let maxLen = 0;
  // lower diagonal of matrix is not used i > j, fill diagonal values
  for (let i = 0; i < n; ++i) {
    sum[i][i] = str[i] - "0";
  }
  for (let len = 2; len <= n; ++len) {
    for (let i = 0; i < n - len + 1; ++i) {
      let j = i + len - 1;
      let k = len / 2;
      // calculate value of sum[i][j]
      sum[i][j] = sum[i][j - k] + sum[j - k + 1][j];
      // update if len is even, left and right sums are same and len is more than max
      if (len % 2 == 0 && sum[i][j - k] == sum[j - k + 1][j] && len > maxLen) {
        maxLen = len;
      }
    }
  }
  return maxLen;
}
// console.log('35 ', maxSubstrnigLengthDP('142124'));

// Given a string, find the first non-repeating character in it and return it's index. If it doesn't exist, return -1.
// s = "leetcode" return 0.
// s = "loveleetcode" return 2.
function firstUniqChar(s) {
  const characters = new Map();
  for (let i = 0; i < s.length; i++) {
    let current = s.at(i);
    if (characters.has(current)) {
      characters.set(current, -1);
    } else {
      characters.set(current, i);
    }
  }

  let min = Infinity;
  for (let c of characters) {
    if (characters.get(c) > -1 && characters.get(c) < min) {
      min = characters.get(c);
    }
  }

  return min == Infinity ? -1 : min;
}
// console.log('36 ', firstUniqChar('loveleetcode'));

// Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.
// Input: "babad" -> Output: "bab"
// Input: "cbbd" -> Output: "bb"
function longestPalindrome(s) {
  if (s == null || s.length == 0) {
    return "";
  }

  function isPalindrome(s) {
    let i = 0;
    let j = s.length - 1;
    while (i <= j) {
      if (s.at(i++) != s.at(j--)) {
        return false;
      }
    }
    return true;
  }

  let longestPalindromicSubstring = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      if (
        j - i > longestPalindromicSubstring.length &&
        isPalindrome(s.substring(i, j))
      ) {
        longestPalindromicSubstring = s.substring(i, j);
      }
    }
  }

  return longestPalindromicSubstring;
}
// console.log('37 ', longestPalindrome('babad'));

// Given an input string, reverse the string word by word.
// s = "the sky is blue" -> "blue is sky the".
function reverseWords(s) {
  const words = s.trim().split("\\s+");
  let result = "";
  for (let i = words.length - 1; i > 0; i--) {
    result += words[i] + " ";
  }

  return result + words[0];
}
// console.log('38 ', reverseWords('the sky is blue'));

// A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).
// The robot can only move either down or right at any point in time. The robot is trying to reach
// the bottom-right corner of the grid (marked 'Finish' in the diagram below).
// How many possible unique paths are there?
function uniquePaths(m, n) {
  const map = new Array(m).finll(new Array(n));
  // only 1 way to get to ith row, 0th column (move down)
  for (let i = 0; i < m; i++) {
    map[i][0] = 1;
  }

  // only 1 way to get to ith column, 0th row (move right)
  for (let j = 0; j < n; j++) {
    map[0][j] = 1;
  }

  // x ways to get to ith row, jth column (# of ways to get to
  // ith - 1 row, jth column + # of ways to get to jth - 1 column
  // ith column
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      map[i][j] = map[i - 1][j] + map[i][j - 1];
    }
  }

  return map[m - 1][n - 1];
}
// console.log('39 ', uniquePaths(null));

// Given two binary strings, return their sum (also a binary string).
// a = "11" b = "1" -> "100"
function addBinary(a, b) {
  let result = "";
  let carry = 0;

  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0) {
    let sum = carry;
    if (i >= 0) {
      sum += a.at(i--) - "0";
    }
    if (j >= 0) {
      sum += b.at(j--) - "0";
    }
    result = result.concat(sum % 2);
    carry = sum / 2;
  }

  if (carry != 0) {
    result = result.concat(carry);
  }

  return result.split("").reverse().join("");
}
// console.log('40 ', addBinary(null));

// Given a binary tree, return the level order traversal of its nodes' values. (ie, from left to right, level by level).
// binary tree [3,9,20,null,null,15,7],
//     3
//    / \
//   9  20
//     /  \
//    15   7
// return its level order traversal as:
// [
//   [3],
//   [9,20],
//   [15,7]
// ]
function levelOrder(root) {
  let result = [];
  if (root == null) {
    return result;
  }

  let queue = [];
  queue.push(root);
  result.push([root.val]);

  while (!queue.length) {
    let currentLevel = [];
    let list = [];

    while (!queue.isEmpty()) {
      let current = queue.pop();

      if (current.left != null) {
        currentLevel.push(current.left);
        list.push(current.left.val);
      }
      if (current.right != null) {
        currentLevel.push(current.right);
        list.push(current.right.val);
      }
    }

    if (list.length > 0) {
      result.push(list);
    }
    queue = currentLevel;
  }

  return result;
}
// console.log('41 ', levelOrder(null));

// Given a binary tree, return all root-to-leaf paths.
// example, given the following binary tree:
//    1
//  /   \
// 2     3
//  \
//   5
// All root-to-leaf paths are: ["1->2->5", "1->3"]
function binaryTreePaths(root) {
  let result = [];

  if (root == null) {
    return result;
  }

  function helper(current, root, result) {
    if (root.left == null && root.right == null) {
      result.push(current + root.val);
    }

    if (root.left != null) {
      helper(current + root.val + "->", root.left, result);
    }

    if (root.right != null) {
      helper(current + root.val + "->", root.right, result);
    }
  }

  helper("", root, result);

  return result;
}
// console.log('42 ', binaryTreePaths(null));

// Given a binary tree, return the vertical order traversal of its nodes' values. (ie, from top to bottom, column by column).
// If two nodes are in the same row and column, the order should be from left to right.
// Given binary tree [3,9,8,4,0,1,7,null,null,null,2,5] (0's right child is 2 and 1's left child is 5),
//      3
//     /\
//    /  \
//    9   8
//   /\  /\
//  /  \/  \
//  4  01   7
//     /\
//    /  \
//    5   2
// return its vertical order traversal as:
// [
//   [4],
//   [9,5],
//   [3,0,1],
//   [8,2],
//   [7]
// ]
function verticalOrder(root) {
  let result = [];
  if (root == null) {
    return result;
  }

  let map = new Map();
  let q = [];
  let cols = [];

  q.push(root);
  cols.push(0);

  let min = 0;
  let max = 0;

  while (!q.length) {
    let node = q.shift();
    let col = cols.shift();
    if (!map.has(col)) {
      map.set(col, []);
    }

    map.get(col).push(node.val);
    if (node.left != null) {
      q.push(node.left);
      cols.push(col - 1);
      min = Math.min(min, col - 1);
    }

    if (node.right != null) {
      q.push(node.right);
      cols.push(col + 1);
      max = Math.max(max, col + 1);
    }
  }

  for (let i = min; i <= max; i++) {
    result.push(map.get(i));
  }

  return result;
}
// console.log('43 ', verticalOrder(null));

// Given an integer array with all positive numbers and no duplicates, find the number of
// possible combinations that add up to a positive integer target.
// nums = [1, 2, 3]
// target = 4
// The possible combination ways are:
// (1, 1, 1, 1)
// (1, 1, 2)
// (1, 2, 1)
// (1, 3)
// (2, 1, 1)
// (2, 2)
// (3, 1)
// Note that different sequences are counted as different combinations. Therefore the output is 7.
function combinationSum4(nums, target) {
  let dp = [];
  dp[0] = 1;

  for (let i = 1; i < dp.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i - nums[j] >= 0) {
        dp[i] += dp[i - nums[j]];
      }
    }
  }

  return dp[target];
}
// console.log('44 ', combinationSum4(null));

// The count-and-say sequence is the sequence of integers beginning as follows:
// 1, 11, 21, 1211, 111221, ...
// 1 is read off as "one 1" or 11.
// 11 is read off as "two 1s" or 21.
// 21 is read off as "one 2, then one 1" or 1211.
function countAndSay(n) {
  function helper(s) {
    let sb = "";
    let c = s.at(0);
    let count = 1;
    for (let i = 1; i < s.length; i++) {
      if (s.at(i) == c) {
        count++;
      } else {
        sb = sb.concat(count);
        sb = sb.concat(c);
        c = s.at(i);
        count = 1;
      }
    }

    sb = sb.concat(count);
    sb = sb.concat(c);
    return sb;
  }
  let s = "1";
  for (let i = 1; i < n; i++) {
    s = helper(s);
  }

  return s;
}
// console.log('45 ', countAndSay(null));

// A message containing letters from A-Z is being encoded to numbers using the following mapping:
// 'A' -> 1 'B' -> 2 ... 'Z' -> 26
// Given an encoded message containing digits, determine the total number of ways to decode it.
// Given encoded message "12", it could be decoded as "AB" (1 2) or "L" (12).
// The number of ways decoding "12" is 2.
function numDecodings(s) {
  let n = s.length;
  if (n == 0) {
    return 0;
  }

  let dp = new Array(n + 1);
  dp[n] = 1;
  dp[n - 1] = s.at(n - 1) != "0" ? 1 : 0;

  for (let i = n - 2; i >= 0; i--) {
    if (s.at(i) == "0") {
      continue;
    } else {
      dp[i] =
        parseInt(s.substring(i, i + 2)) <= 26
          ? dp[i + 1] + dp[i + 2]
          : dp[i + 1];
    }
  }

  return dp[0];
}
// console.log('46 ', numDecodings(null));

// binary search
function findQuick(arr, val) {
  let start = 0;
  let end = arr.length;

  while (start < end) {
    let mid = start + (end - start) / 2;
    if (mid != val) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }

  return start;
}
// console.log('47 ', findQuick(null));

// Given a set of non-overlapping intervals, insert a new interval into the intervals (merge if necessary).
// You may assume that the intervals were initially sorted according to their start times.
//
// Given intervals [1,3],[6,9], insert and merge [2,5] in as [1,5],[6,9].
//
// Given [1,2],[3,5],[6,7],[8,10],[12,16], insert and merge [4,9] in as [1,2],[3,10],[12,16].
// This is because the new interval [4,9] overlaps with [3,5],[6,7],[8,10].
class Interval {
  constructor(s, e) {
    this.start = s || 0;
    this.end = e || 0;
  }
}

function insertInterval(intervals, newInterval) {
  let i = 0;
  let n = intervals.length;

  while (i < n && intervals[i].end < newInterval.start) {
    i++;
  }
  while (i < n && intervals[i].start <= newInterval.end) {
    newInterval = new Interval(
      Math.min(intervals[i].start, newInterval.start),
      Math.max(intervals[i].end, newInterval.end)
    );
    intervals.splice(i, 1);
  }
  intervals.push(newInterval);

  return intervals;
}
// console.log('48 ', insertInterval(null));

// Kadane's algorithm
function maxSubarraySum(arr, N) {
  let max_so_far = -Infinity;
  let max_ending_here = 0;
  let max_element = -Infinity;
  let { max } = Math;

  for (let i = 0; i < N; i++) {
    max_ending_here = max(max_ending_here + arr[i], 0);
    max_so_far = max(max_ending_here, max_so_far);
    max_element = max(max_element, arr[i]);
  }

  if (max_so_far === 0) max_so_far = max_element;
  return max_so_far;
}
// console.log('49 ', maxSubarraySum([1,2,3,-2,5]));

function missingNumber(arr, n) {
  let givensum = 0;
  let totalsum = (n * (n + 1)) / 2;

  for (let i = 0; i < n - 1; i++) {
    givensum += arr[i];
  }

  return totalsum - givensum;
}
// console.log('50 ', missingNumber([1,2,3,-2,5]));

// Merge Without Extra Space
// n = 4, arr1[] = [1 3 5 7]
// m = 5, arr2[] = [0 2 6 8 9]
// [0 1 2 3] [5 6 7 8 9]
function merge(arr1, arr2, n, m) {
  let i = 0;
  while (arr1[n - 1] > arr2[0]) {
    if (arr1[i] > arr2[0]) {
      let tmp = arr1[i];
      arr1[i] = arr2[0];
      arr2[0] = tmp;
      arr2.sort((a, b) => a - b);
    }
    i++;
  }
}
// console.log('51 ', merge());

// Given an unsorted array of integers, find the length of the longest consecutive elements sequence.
// Given [100, 4, 200, 1, 3, 2] The longest consecutive elements sequence is [1, 2, 3, 4]. Return its length: 4.
// Your algorithm should run in O(n) complexity.
function longestConsecutive(nums) {
  if (nums == null || nums.length == 0) {
    return 0;
  }

  let set = new Set();
  for (let n of nums) {
    set.add(n);
  }

  let maxLength = 0;
  for (let n of set) {
    if (!set.has(n - 1)) {
      let current = n;
      let currentMax = 1;

      while (set.has(n + 1)) {
        currentMax++;
        n++;
      }

      maxLength = Math.max(maxLength, currentMax);
    }
  }

  return maxLength;
}

// Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.
// According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined
// between two nodes v and w as the lowest node in T that has both v and w as descendants
// (where we allow a node to be a descendant of itself).”
function lowestCommonAncestor(root, p, q) {
  if (root == null || root == p || root == q) {
    return root;
  }

  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);

  if (left != null && right != null) {
    return root;
  }

  return left == null ? right : left;
}

// Given an array nums and a target value k, find the maximum length of a subarray that sums to k.
// If there isn't one, return 0 instead. The sum of the entire nums array is guaranteed to fit
// within the 32-bit signed integer range.
// Given nums = [1, -1, 5, -2, 3], k = 3,
// return 4. (because the subarray [1, -1, 5, -2] sums to 3 and is the longest)
function maxSubArrayLen(nums, k) {
  if (nums.length == 0) {
    return 0;
  }
  let map = new Map();
  let maxLength = 0;
  let total = 0;
  map.set(0, -1);

  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
    if (map.has(total - k)) {
      maxLength = Math.max(maxLength, i - map.get(total - k));
    }
    if (!map.has(total)) {
      map.set(total, i);
    }
  }

  return maxLength;
}

// Given an array of n positive integers and a positive integer s, find the
// minimal length of a contiguous subarray of which the sum ≥ s. If there isn't one, return 0 instead.
// Given the array [2,3,1,2,4,3] and s = 7,
// the subarray [4,3] has the minimal length under the problem constraint.
function minSubArrayLen(s, nums) {
  if (nums == null || nums.length == 0) {
    return 0;
  }

  let i = 0;
  let j = 0;
  let result = Infinity;
  let total = 0;

  while (i < nums.length) {
    total += nums[i++];

    while (total >= s) {
      result = Math.min(result, i - j);
      total -= nums[j++];
    }
  }

  return result == Infinity ? 0 : result;
}

// Given a string S and a string T, find the minimum window in S which will contain all the characters in T in complexity O(n).
// For example: S = "ADOBECODEBANC" T = "ABC" ->  Minimum window is "BANC".
// If there is no such window in S that covers all characters in T, return the empty string "".
// If there are multiple such windows, you are guaranteed that there will always be only one unique minimum window in S.
function minWindow(s, t) {
  let map = new Map();

  for (let c of s) {
    map.set(c, 0);
  }

  for (let c of t) {
    if (map.has(c)) {
      map.set(c, map.get(c) + 1);
    } else {
      return "";
    }
  }

  let start = 0;
  let end = 0;
  let minStart = 0;
  let minLength = Infinity;
  let counter = t.length;

  while (end < s.length) {
    let c1 = s.at(end);
    if (map.get(c1) > 0) {
      counter--;
    }
    map.set(c1, map.get(c1) - 1);
    end++;

    while (counter == 0) {
      if (minLength > end - start) {
        minLength = end - start;
        minStart = start;
      }

      let c2 = s.at(start);
      map.set(c2, map.get(c2) + 1);
      if (map.get(c2) > 0) {
        counter++;
      }
      start++;
    }
  }

  return minLength == Infinity
    ? ""
    : s.substring(minStart, minStart + minLength);
}

// Given an array nums, write a function to move all 0's to the end of it while maintaining
// the relative order of the non-zero elements.
// For example, given nums = [0, 1, 0, 3, 12], after calling your function, nums should be [1, 3, 12, 0, 0].
// Note: You must do this in-place without making a copy of the array. Minimize the total number of operations.
function moveZeroes(nums) {
  if (nums == null || nums.length == 0) {
    return;
  }

  let index = 0;
  for (let num of nums) {
    if (num != 0) {
      nums[index] = num;
      index++;
    }
  }

  while (index < nums.length) {
    nums[index] = 0;
    index++;
  }
}

// Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2.
function multiply(num1, num2) {
  let m = num1.length;
  let n = num2.length;
  let pos = new Array(m + n);

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let mul = (num1.at(i) - "0") * (num2.at(j) - "0");
      let p1 = i + j;
      let p2 = i + j + 1;
      let sum = mul + pos[p2];

      pos[p1] += sum / 10;
      pos[p2] = sum % 10;
    }
  }

  let sb = "";
  for (let p of pos) {
    if (!(sb.length == 0 && p == 0)) {
      sb += sb.concat(p);
    }
  }

  return sb.length == 0 ? "0" : sb;
}

// Given a 2d grid map of '1's (land) and '0's (water), count the number of islands. An island is
// surrounded by water and is formed by connecting adjacent lands horizontally or vertically.
// You may assume all four edges of the grid are all surrounded by water.
function numIslands(grid) {
  gridCopy = grid;
  let numberOfIslands = 0;

  function sink(grid, i, j) {
    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      grid[i][j] == "0"
    ) {
      return 0;
    }
    grid[i][j] = "0";
    sink(grid, i + 1, j);
    sink(grid, i - 1, j);
    sink(grid, i, j + 1);
    sink(grid, i, j - 1);
    return 1;
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      numberOfIslands += sink(gridCopy, i, j);
    }
  }
  return numberOfIslands;
}

// Given two strings S and T, determine if they are both one edit distance apart.
function isOneEditDistance(s, t) {
  // iterate through the length of the smaller string
  for (let i = 0; i < Math.min(s.length, t.length); i++) {
    // if the current characters of the two strings are not equal
    if (s.at(i) != t.at(i)) {
      // return true if the remainder of the two strings are equal, false otherwise
      if (s.length == t.length) {
        return s.substring(i + 1) == t.substring(i + 1);
      } else if (s.length < t.length) {
        // return true if the strings would be the same if you deleted a character from string t
        return s.substring(i) == t.substring(i + 1);
      } else {
        // return true if the strings would be the same if you deleted a character from string s
        return t.substring(i) == s.substring(i + 1);
      }
    }
  }

  // if all characters match for the length of the two strings check if the two strings' lengths do not differ by more than 1
  return Math.abs(s.length - t.length) == 1;
}

// There are a row of n houses, each house can be painted with one of the k colors. The cost of painting
// each house with a certain color is different. You have to paint all the houses such that no two adjacent houses have the same color.
// The cost of painting each house with a certain color is represented by a n x k cost matrix. For example, costs[0][0] is the cost of
// painting house 0 with color 0; costs[1][2] is the cost of painting house 1 with color 2, and so on... Find the minimum cost
// to paint all houses.
// All costs are positive integers.
function minCostII(costs) {
  if (costs == null || costs.length == 0) {
    return 0;
  }

  let m = costs.length;
  let n = costs[0].length;
  let min1 = -1;
  let min2 = -1;

  for (let i = 0; i < m; i++) {
    let last1 = min1;
    let last2 = min2;

    min1 = -1;
    min2 = -1;

    for (let j = 0; j < n; j++) {
      if (j != last1) {
        costs[i][j] += last1 < 0 ? 0 : costs[i - 1][last1];
      } else {
        costs[i][j] += last2 < 0 ? 0 : costs[i - 1][last2];
      }

      if (min1 < 0 || costs[i][j] < costs[i][min1]) {
        min2 = min1;
        min1 = j;
      } else if (min2 < 0 || costs[i][j] < costs[i][min2]) {
        min2 = j;
      }
    }
  }

  return costs[m - 1][min1];
}

// palindrome linked list
function isPalindrome(head) {
  if (head == null || head.next == null) {
    return true;
  }

  let stack = [];
  let fast = head;
  let slow = head;

  while (fast != null && fast.next != null) {
    stack.push(slow.val);
    fast = fast.next.next;
    slow = slow.next;
  }

  if (fast != null) {
    slow = slow.next;
  }

  while (slow != null) {
    if (stack.pop() != slow.val) {
      return false;
    }
    slow = slow.next;
  }

  return true;
}

// Given a string, your task is to count how many palindromic substrings in this string.
// The substrings with different start indexes or end indexes are counted as different substrings
// even they consist of same characters.
// Input: "aaa" Output: 6
// Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".
function countSubstrings(s) {
  if (s == null || s.length == 0) {
    return 0;
  }

  function extendPalindrome(s, left, right) {
    while (left >= 0 && right < s.length && s.at(left) == s.at(right)) {
      result++;
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    extendPalindrome(s, i, i);
    extendPalindrome(s, i, i + 1);
  }

  return result;
}

// implement pow(x, n)
function pow(x, n) {
  if (n == 0) {
    return 1;
  }
  if (x == Infinity) {
    return 0;
  }

  if (n < 0) {
    n = -n;
    x = 1 / x;
  }
  return n % 2 == 0 ? pow(x * x, n / 2) : x * pow(x * x, n / 2);
}

// Given an array of n integers where n > 1, nums, return an array output such that output[i] is equal to
// the product of all the elements of nums except nums[i]. Solve it without division and in O(n).
// For example, given [1,2,3,4], return [24,12,8,6].
function productExceptSelf(nums) {
  let n = nums.length;
  let result = new Array(n);
  let left = 1;

  for (let i = 0; i < nums.length; i++) {
    if (i > 0) {
      left *= nums[i - 1];
    }
    result[i] = left;
  }

  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    if (i < n - 1) {
      right *= nums[i + 1];
    }
    result[i] *= right;
  }

  return result;
}

// Given a sorted array, remove the duplicates in place such that each element appear only once and return the new length.
// Do not allocate extra space for another array, you must do this in place with constant memory.
// Given input array nums = [1,1,2],
// Your function should return length = 2, with the first two elements of nums being 1 and 2 respectively.
// It doesn't matter what you leave beyond the new length.
function removeDuplicates(nums) {
  if (nums.length == 0 || nums == null) {
    return 0;
  }
  if (nums.length < 2) {
    return nums.length;
  }
  let index = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] != nums[i - 1]) {
      nums[index++] = nums[i];
    }
  }

  return index;
}

// Remove the minimum number of invalid parentheses in order to make the input string valid. Return all possible results.
// Note: The input string may contain letters other than the parentheses ( and ).
// Examples:
// "()())()" -> ["()()()", "(())()"]
// "(a)())()" -> ["(a)()()", "(a())()"]
// ")(" -> [""]
function removeInvalidParentheses(s) {
  let result = new Array();
  function remove(s, result, last_i, last_j, par) {
    for (let stack = 0, i = last_i; i < s.length; i++) {
      if (s.at(i) == par[0]) {
        stack++;
      }
      if (s.at(i) == par[1]) {
        stack--;
      }
      if (stack >= 0) {
        continue;
      }

      for (let j = last_j; j <= i; j++) {
        if (s.at(j) == par[1] && (j == last_j || s.at(j - 1) != par[1])) {
          remove(
            s.substring(0, j) + s.substring(j + 1, s.length),
            result,
            i,
            j,
            par
          );
        }
      }
      return;
    }

    let reversed = s.split("").reverse().join("");
    if (par[0] == "(") {
      // finished left to right
      remove(reversed, result, 0, 0, [")", "("]);
    } else {
      // finished right to left
      result.add(reversed);
    }
  }

  remove(s, result, 0, 0, ["(", ")"]);
  return result;
}

// implement sqrt(x)
function sqrt(x) {
  if (x == 0) {
    return 0;
  }

  let left = 1;
  let right = x;

  while (left <= right) {
    let mid = left + (right - left) / 2;
    if (mid == x / mid) {
      return mid;
    } else if (mid > x / mid) {
      right = mid - 1;
    } else if (mid < x / mid) {
      left = mid + 1;
    }
  }

  return right;
}

// Given a set of distinct integers, nums, return all possible subsets.
// Note: The solution set must not contain duplicate subsets.
// nums = [1,2,3]:
// [
//   [3],
//   [1],
//   [2],
//   [1,2,3],
//   [1,3],
//   [2,3],
//   [1,2],
//   []
// ]
function subsets(nums) {
  let result = [];
  function recurse(result, nums, path, position) {
    if (position == nums.length) {
      result.push([...path]);
      return;
    }

    path.push(nums[position]);
    recurse(result, nums, path, position + 1);
    path.pop();
    recurse(result, nums, path, position + 1);
  }
  recurse(result, nums, [], 0);
  return result;
}

// Given a collection of integers that might contain duplicates, nums, return all possible subsets.
// Note: The solution set must not contain duplicate subsets.
// For example,
// If nums = [1,2,2], a solution is:
// [
//   [2],
//   [1],
//   [1,2,2],
//   [2,2],
//   [1,2],
//   []
// ]
function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  let result = [];
  if (nums.length == 0 || nums == null) {
    return result;
  }
  function helper(nums, current, index, result) {
    result.push(current);

    for (let i = index; i < nums.length; i++) {
      if (i > index && nums[i] == nums[i - 1]) {
        continue;
      }

      let newCurrent = new Array(current);

      newCurrent.push(nums[i]);

      helper(nums, newCurrent, i + 1, result);
    }
  }

  helper(nums, [], 0, result);
  return result;
}

// Find the sum of all left leaves in a given binary tree.
function sumOfLeftLeaves(root) {
  if (root == null) {
    return 0;
  }

  let total = 0;
  if (root.left != null) {
    if (root.left.left == null && root.left.right == null) {
      total += root.left.val;
    } else {
      total += sumOfLeftLeaves(root.left);
    }
  }

  total += sumOfLeftLeaves(root.right);
  return total;
}

// Given an array of integers, return indices of the two numbers such that they add up to a specific target.
// You may assume that each input would have exactly one solution, and you may not use the same element twice.
// Given nums = [2, 7, 11, 15], target = 9,
function twoSum(nums, target) {
  let result = new Array(2);
  let map = new Map();

  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) {
      result[1] = i;
      result[0] = map.get(target - nums[i]);
      return result;
    }
    map.set(nums[i], i);
  }
  return result;
}

// valid palindrome
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right) {
      left++;
    }
    while (right > left) {
      right--;
    }
    if (s.at(left).toLowerCase() != s.at(right).toLowerCase()) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

// Given a binary tree, determine if it is a valid binary search tree (BST).
function isValidBST(root) {
  if (root == null) {
    return true;
  }

  function validBSTRecursive(root, minValue, maxValue) {
    if (root == null) {
      return true;
    } else if (root.val >= maxValue || root.val <= minValue) {
      return false;
    } else {
      return (
        validBSTRecursive(root.left, minValue, root.val) &&
        validBSTRecursive(root.right, root.val, maxValue)
      );
    }
  }

  return validBSTRecursive(root, -Infinity, Infinity);
}

// You are given a m x n 2D grid initialized with these three possible values.
// -1 - A wall or an obstacle.
// 0 - A gate.
// INF - Infinity means an empty room. We use the value 231 - 1 = 2147483647 to represent INF as you may assume that the distance to a gate is less than 2147483647.
// Fill each empty room with the distance to its nearest gate. If it is impossible to reach a gate, it should be filled with INF.
// For example, given the 2D grid:
// INF  -1  0  INF
// INF INF INF  -1
// INF  -1 INF  -1
//   0  -1 INF INF
// After running your function, the 2D grid should be:
//   3  -1   0   1
//   2   2   1  -1
//   1  -1   2  -1
//   0  -1   3   4
function wallsAndGates(rooms) {
  // iterate through the matrix calling dfs on all indices that contain a zero
  function dfs(rooms, i, j, distance) {
    if (
      i < 0 ||
      i >= rooms.length ||
      j < 0 ||
      j >= rooms[0].length ||
      rooms[i][j] < distance
    ) {
      return;
    }
    //set current index's distance to distance
    rooms[i][j] = distance;

    //recurse on all adjacent neighbors of rooms[i][j]
    dfs(rooms, i + 1, j, distance + 1);
    dfs(rooms, i - 1, j, distance + 1);
    dfs(rooms, i, j + 1, distance + 1);
    dfs(rooms, i, j - 1, distance + 1);
  }
  for (let i = 0; i < rooms.length; i++) {
    for (let j = 0; j < rooms[0].length; j++) {
      if (rooms[i][j] == 0) {
        dfs(rooms, i, j, 0);
      }
    }
  }
}

// Given a 2D board and a word, find if the word exists in the grid.
// The word can be constructed from letters of sequentially adjacent cell, where "adjacent" cells are
// those horizontally or vertically neighboring. The same letter cell may not be used more than once.
// Given board =
// [
//   ['A','B','C','E'],
//   ['S','F','C','S'],
//   ['A','D','E','E']
// ]
// word = "ABCCED", -> returns true,
// word = "SEE", -> returns true,
// word = "ABCB", -> returns false.
function exist(board, word) {
  let w = word.split("");

  function search(board, i, j, w, index) {
    if (index == w.length) {
      return true;
    }

    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
      return false;
    }

    if (board[i][j] != w[index]) {
      return false;
    }

    board[i][j] ^= 256;

    let exist =
      search(board, i + 1, j, w, index + 1) ||
      search(board, i - 1, j, w, index + 1) ||
      search(board, i, j + 1, w, index + 1) ||
      search(board, i, j - 1, w, index + 1);
    board[i][j] ^= 256;

    return exist;
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (search(board, i, j, w, 0)) {
        return true;
      }
    }
  }

  return false;
}

// create spiral matrix
function createSpiral(n) {
  const grid = new Array(n).fill(new Array(n).fill(0));
  let counter = 1;

  let right = n - 1;
  let left = 0;
  let top = 0;
  let bottom = n - 1;

  while (right >= left) {
    // go right
    for (let i = left; i <= right; ++i) {
      grid[top][i] = counter++;
    }
    top++;
    // go down
    for (let j = top; j <= bottom; ++j) {
      grid[j][right] = counter++;
    }
    right--;
    // go left
    for (let k = right; k >= left; --k) {
      grid[bottom][k] = counter++;
    }
    bottom--;
    // go up
    for (let l = bottom; l >= top; --l) {
      grid[l][left] = counter++;
    }
    left++;
  }

  return grid;
}

// find closes exit
function findClosestExit(grid) {
  let N = grid.length;
  let M = grid[0].length;
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];
  const passed = new Array(N).fill(new Array(M).fill(0));
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
        grid[moveX][moveY] == "." &&
        !passed[moveX][moveY]
      ) {
        passed[moveX][moveY] = 1;
        queue.push([moveX, moveY]);
      }
    }
  }

  return false;
}

// invert binary tree
function invertTree(root) {
  if (!root) {
    return root;
  }
  let left = invertTree(root.left);
  let right = invertTree(root.right);

  root.left = left === undefined ? null : right;
  root.right = right === undefined ? null : left;
  return root;
}
