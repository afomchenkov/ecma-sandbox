function printParenthesis(n) {
  const str = new Array(100);
  const result = [];

  function _printParenthesis(pos, n, open, close) {
    if (close == n) {
      result.push(str.join(""));
      return;
    }

    if (open > close) {
      str[pos] = "}";
      _printParenthesis(pos + 1, n, open, close + 1);
    }

    if (open < n) {
      str[pos] = "{";
      _printParenthesis(pos + 1, n, open + 1, close);
    }
  }

  _printParenthesis(0, n, 0, 0);

  return result;
}

const generateParenBacktracking = (n) => {
  const result = [];

  const backtrack = (curr, leftCount, rightCount) => {
    if (curr.length == 2 * n) {
      result.push(curr.join(""));
    }

    if (leftCount < n) {
      curr.push("{");
      backtrack(curr, leftCount + 1, rightCount);
      curr.pop();
    }

    if (leftCount > rightCount) {
      curr.push("}");
      backtrack(curr, leftCount, rightCount + 1);
      curr.pop();
    }
  };

  backtrack([], 0, 0);

  return result;
};

// implementation 1
function findWord1(board, word) {
  const ROWS = board.length;
  const COLS = board[0].length;

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  function backtrack(row, col, suffix) {
    if (suffix.length == 0) return true;
    if (
      row < 0 ||
      row == ROWS ||
      col < 0 ||
      col == COLS ||
      board[row][col] != suffix.charAt(0)
    ) {
      return false;
    }

    let ret = false;
    // mark the path before the next exploration
    board[row][col] = "#";
    for (let [rowOffset, colOffset] of directions) {
      ret = backtrack(row + rowOffset, col + colOffset, suffix.slice(1));
      if (ret) {
        break;
      }
    }
    // backtrack
    board[row][col] = suffix.charAt(0);
    return ret;
  }

  for (let row = 0; row < ROWS; ++row) {
    for (let col = 0; col < COLS; ++col) {
      if (backtrack(row, col, word)) {
        return true;
      }
    }
  }
  return false;
}

// implementation 2
function findWord2(board, word) {
  const ROWS = board.length;
  const COLS = board[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  function backtrack(row, col, suffix) {
    if (suffix.length == 0) return true;
    if (
      row < 0 ||
      row == ROWS ||
      col < 0 ||
      col == COLS ||
      board[row][col] != suffix.charAt(0)
    ) {
      return false;
    }

    // mark the path before the next exploration
    board[row][col] = "#";
    for (let [rowOffset, colOffset] of directions) {
      if (backtrack(row + rowOffset, col + colOffset, suffix.slice(1))) {
        // return without cleanup
        return true;
      }
    }

    // backtrack
    board[row][col] = suffix.charAt(0);
    return false;
  }

  for (let row = 0; row < ROWS; ++row) {
    for (let col = 0; col < COLS; ++col) {
      if (backtrack(row, col, word)) return true;
    }
  }
  return false;
}

// implementation 3
function findWord3(board, word) {
  let rows = board.length;
  let cols = board[0].length;
  let isFound = false;

  function dfs(i, j, charIndex) {
    // check boundaries
    if (i < 0 || i >= rows || j < 0 || j >= cols || board[i][j] == -1) {
      return;
    }

    if (board[i][j] != word.charAt(charIndex)) {
      return;
    }

    if (charIndex >= word.length - 1) {
      // this means the word is found
      isFound = true;
      return;
    }

    const letter = board[i][j];
    // mark as visited
    board[i][j] = -1;

    charIndex += 1;
    dfs(i + 1, j, charIndex);
    dfs(i - 1, j, charIndex);
    dfs(i, j + 1, charIndex);
    dfs(i, j - 1, charIndex);

    // backtrack
    board[i][j] = letter;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] == word.charAt(0)) {
        dfs(i, j, 0);

        if (isFound) {
          return true;
        }
      }
    }
  }

  return false;
}

// HARD: Given a string s and a dictionary of words dict, add spaces in s to construct a
// sentence where each word is a valid dictionary word. Return all such possible sentences.
//
// s = "catsanddog",
// dict = ["cat", "cats", "and", "sand", "dog"].
const wordBreak = (s, wordDict) => {
  const hash = new Map(); // <string, linked_list<string>>

  const dfs = (sentence, wordDict, hash) => {
    if (hash.has(sentence)) {
      return hash.get(sentence);
    }

    let res = [];
    if (sentence.length == 0) {
      res.push("");
      return res;
    }

    for (let word of wordDict) {
      if (sentence.startsWith(word)) {
        let sublist = dfs(sentence.substring(word.length), wordDict, hash);

        for (let sub of sublist) {
          res.push(word + (sub.length ? " " : "") + sub);
        }
      }
    }

    hash.set(sentence, res);
    return res;
  };

  return dfs(s, wordDict, hash);
};
