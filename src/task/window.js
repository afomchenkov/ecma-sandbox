{
  /**
   * Find all substrings of the first string that are anagrams of the second string.
   */

  function findAllAnagrams(str, pattern) {
    let m = pattern.length;
    let n = str.length;

    if (m > n) {
      return;
    }

    // maintains the count of characters in the current window
    const window = [];
    // maintains the count of characters in the second string
    const set = pattern.split("");
    set.sort((a, b) => a.localeCompare(b));
    const result = [];

    for (let i = 0; i < n; i++) {
      if (i < m) {
        window.push(str[i]);
      } else {
        window.sort((a, b) => a.localeCompare(b));
        if (window.join('') == set.join('')) {
          // console.log("1 Anagram ", str.substr(i - m, m));
          result.push(i - m);
        }

        let idx = window.findIndex(val => val == str[i - m]);
        if (idx >= 0) {
          window.splice(idx, 1);
        }

        // insert the next character of the string 'str' into the current window
        window.push(str[i]);
      }
    }

    window.sort((a, b) => a.localeCompare(b));
    if (window.join('') == set.join('')) {
      // console.log("2 Anagram ", str.substr(n - m, m));
      result.push(n - m);
    }

    return result;
  }

  // console.log(findAllAnagrams("cbaebabacd", "abc"));
}

function allAnagramsHash(s, p) {
  let ns = s.length;
  let np = p.length;

  if (ns < np) {
    return [];
  }
  
  let pCount = {};
  let sCount = {};
  // Build a reference hashmap using string p
  for (let ch of p) {
    if (pCount[ch]) {
      pCount[ch]++;
    } else {
      pCount[ch] = 1;
    }
  }

  function equals(a, b) {
    for (let k of Object.keys(a)) {
      if (a[k] != b[k]) {
        return false;
      }
    }
    return true;
  }

  let output = [];
  for (let i = 0; i < ns; ++i) {
    // Add one more letter on the right side of the window
    let ch = s.charAt(i);
    if (sCount[ch]) {
      sCount[ch]++;
    } else {
      sCount[ch] = 1;
    }

    // Remove one letter from the left side of the window
    if (i >= np) {
      ch = s.charAt(i - np);
      if (sCount[ch] == 1) {
        delete sCount[ch];
      } else {
        sCount[ch]--;
      }
    }

    // Compare hashmap in the sliding window with the reference hashmap
    if (equals(pCount, sCount)) {
      output.push(i - np + 1);
    }
  }

  return output;
}

console.log(allAnagramsHash("cbaebabacd", "abc"));