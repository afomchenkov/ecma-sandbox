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
console.log(wordBreak("applepenapple", ["apple", "pen"]));
