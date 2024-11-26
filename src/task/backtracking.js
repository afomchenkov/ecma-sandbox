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
