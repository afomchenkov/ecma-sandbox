function wordBreakTopDown(s, wordDict) {
  let memo = new Array(s.length).fill(-1);

  function isValid(i) {
    if (i < 0) {
      return true;
    }

    if (memo[i] != -1) {
      return memo[i] === 1;
    }

    for (let word of wordDict) {
      let wordLen = word.length;
      if (i - wordLen + 1 < 0) {
        continue;
      }
      if (
        s.substring(i - wordLen + 1, i + 1) === word &&
        isValid(i - wordLen)
      ) {
        memo[i] = 1;
        return true;
      }
    }

    memo[i] = 0;
    return false;
  }

  return isValid(s.length - 1);
}

function wordBreakBottomUp(s, wordDict) {
  let dp = new Array(s.length).fill(false);

  for (let i = 0; i < s.length; i++) {
    for (let word of wordDict) {
      // Handle out of bounds case
      if (i < word.length - 1) {
        continue;
      }
      if (i == word.length - 1 || dp[i - word.length]) {
        if (s.substring(i - word.length + 1, i + 1) == word) {
          dp[i] = true;
          break;
        }
      }
    }
  }

  return dp[s.length - 1];
}

function wordBreakAnotherDp(s, wordDict) {
  let n = s.length;
  let words = new Set(wordDict);
  let dp = new Array(n + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  
  return dp[n];
}
