function wordBreak(s, wordDict) {
  let words = new Set(wordDict);
  let queue = [0];
  let seen = new Set();

  while (queue.length) {
    let start = queue.shift();
    if (start == s.length) {
      return true;
    }

    for (let end = start + 1; end <= s.length; end++) {
      if (seen.has(end)) {
        continue;
      }
      // add all possible ends
      if (words.has(s.substring(start, end))) {
        queue.push(end);
        seen.add(end);
      }
    }
  }

  return false;
}
// console.log(wordBreak("applepenapple", ["apple", "pen"]));

function minRemoveToMakeValid(s) {
  const str = s.split("");
  const st = [];
  const toRemove = new Set();

  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      st.push({ br: "(", i });
    }
    if (str[i] == ")") {
      if (st.length == 0) {
        toRemove.add(i);
        continue;
      }
      st.pop();
    }
  }
  for (const r of st) {
    toRemove.add(r.i);
  }
  let res = "";
  for (let j = 0; j < str.length; j++) {
    if (!toRemove.has(j)) {
      res += str[j];
    }
  }

  return res;
}

function minRemoveToMakeValid(s) {
  let indexesToRemove = new Set();
  let stack = [];

  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) == "(") {
      stack.push(i);
    }
    if (s.charAt(i) == ")") {
      if (!stack.length) {
        indexesToRemove.add(i);
      } else {
        stack.pop();
      }
    }
  }
  while (stack.length) indexesToRemove.add(stack.pop());
  let sb = "";
  for (let i = 0; i < s.length; i++) {
    if (!indexesToRemove.has(i)) {
      sb += s.charAt(i);
    }
  }
  return sb.toString();
}
