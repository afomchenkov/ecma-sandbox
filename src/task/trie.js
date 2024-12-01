class TrieNode {
  constructor(char) {
    this.children = [];
    this.char = char;
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode("");
  }

  add(word) {
    let trie = this.root;

    for (const letter of word) {
      let next = trie.children.find((c) => c.char == letter);

      if (!next) {
        const newNode = new TrieNode(letter);
        trie.children.push(newNode);
        next = newNode;
      }

      trie = next;
    }

    trie.isWord = true;
  }

  search(word) {
    let node = this.root;

    for (const letter of word) {
      const c = node.children.find((c) => c.char == letter);

      if (!c) {
        return false;
      }

      node = c;
    }

    return node.isWord;
  }

  hasPrefix() {
    let node = this.root;

    for (const letter of word) {
      const c = node.children.find((c) => c.char == letter);

      if (!c) {
        return false;
      }

      node = c;
    }

    return true;
  }
}

let tr = new Trie();
tr.add("test");
tr.add("testing");
tr.add("estetic");
console.log("1 ", JSON.stringify(tr));
console.log("2 ", tr.search("testing"));


class TrieNode {
  constructor() {
    this.isWord = false;
    this.children = {};
  }
}

function wordBreak(s, wordDict) {
  let root = new TrieNode();

  for (let word of wordDict) {
    let curr = root;
    for (let c of word) {
      if (!curr.children[c]) {
        curr.children[c] = new TrieNode();
      }
      curr = curr.children[c];
    }
    curr.isWord = true;
  }

  const dp = Array(s.length).fill(false);

  for (let i = 0; i < s.length; i++) {
    if (i === 0 || dp[i - 1]) {
      let curr = root;
      
      for (let j = i; j < s.length; j++) {
        let c = s[j];
        if (!curr.children[c]) {
          // No words exist
          break;
        }
        curr = curr.children[c];
        if (curr.isWord) {
          dp[j] = true;
        }
      }
    }
  }
  return dp[s.length - 1];
}
