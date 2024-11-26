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
