function generateParenthesisDFS(left, right, s, answer) {
  if (left == 0 && right == 0) {
    answer.push(s.join(""));
  }

  if (left > right || left < 0 || right < 0) {
    return;
  }

  s.push("{");
  generateParenthesisDFS(left - 1, right, s, answer);
  s.pop();

  s.push("}");
  generateParenthesisDFS(left, right - 1, s, answer);
  s.pop();
}

let ans = [];
let s = [];
// initially we are passing the counts of open and close as 0, and the string s as an empty arr.

generateParenthesisDFS(N, N, s, ans);
console.log('Result2: ', ans);
