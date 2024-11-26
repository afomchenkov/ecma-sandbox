const Node = class {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
};

/**
 *               1
 *             /   \
 *            2     3
 *           / \   / \
 *          4   5 6   7
 *               / \
 *              8   9
 */
const root = new Node(1);
root.left = new Node(2);
root.right = new Node(3);

root.left.left = new Node(4);
const node5 = new Node(5);
root.left.right = node5;

const node6 = new Node(6);
root.right.left = node6;
root.right.right = new Node(7);

root.right.left.left = new Node(8);
const node9 = new Node(9);
// node9.left = new Node(100);
root.right.left.right = node9;

// ------------------------------------------------------------

function printPreorder(node) {
  if (node == null) {
    return;
  }

  // handle root first
  console.log(node.data);
  printPreorder(node.left);
  printPreorder(node.right);
}

function printInorder(node) {
  if (node == null) {
    return;
  }

  printInorder(node.left);
  // hanle root in order
  console.log(node.data);
  printInorder(node.right);
}

function printPostorder(node) {
  if (node == null) {
    return;
  }

  printPostorder(node.left);
  printPostorder(node.right);
  // handle root last
  console.log(node.data);
}

// ------------------------------------------------------------

function printLeafToRoot(root) {
  function isLeaf(node) {
    return node.left == null && node.right == null;
  }

  function _printLeafToRootPaths(node, path) {
    if (node == null) {
      return;
    }

    path.push(node.data);
    if (isLeaf(node)) {
      console.log([...path].reverse());
    }

    _printLeafToRootPaths(node.left, path);
    _printLeafToRootPaths(node.right, path);

    // backtrack: remove the current node after the left, and right subtree are done
    path.pop();
  }

  const path = [];
  _printLeafToRootPaths(root, path);
}
// printLeafToRoot(root);

function binaryTreePaths(root) {
  let res = [];
  if (root == null) {
    return res;
  }

  function buildPath(root, path) {
    if (root.left == null && root.right == null) {
      res.push(path);
      return;
    }

    if (root.left != null) {
      buildPath(root.left, path + "->" + root.left.data);
    }

    if (root.right != null) {
      buildPath(root.right, path + "->" + root.right.data);
    }
  }

  buildPath(root, root.data);

  return res;
}
// console.log(binaryTreePaths(root));

// Binary Tree Vertical Order Traversal
function verticalOrder(root) {
  let res = [];
  if (root == null) {
    return res;
  }
  let dict = new Map();
  let queue = [];
  let code = [];

  queue.push(root);
  code.push(0);

  while (queue.length) {
    let front = queue.shift();
    let val = code.shift();
    if (!dict.has(val)) {
      dict.set(val, []);
    }

    dict.get(val).push(front.data);

    if (front.left) {
      queue.push(front.left);
      code.push(val - 1);
    }

    if (front.right) {
      queue.push(front.right);
      code.push(val + 1);
    }
  }

  res.push(...dict.values());
  return res;
}
// console.log(verticalOrder(root));

function buildTree(preorder, inorder) {
  function helper(preStart, inStart, inEnd, preorder, inorder) {
    if (preStart > preorder.length - 1 || inStart > inEnd) {
      return null;
    }
    let root = new TreeNode(preorder[preStart]);
    let inIndex = 0; // Index of current root in inorder
    for (let i = inStart; i <= inEnd; i++) {
      if (inorder[i] == root.val) {
        inIndex = i;
      }
    }
    root.left = helper(preStart + 1, inStart, inIndex - 1, preorder, inorder);
    root.right = helper(
      preStart + inIndex - inStart + 1,
      inIndex + 1,
      inEnd,
      preorder,
      inorder
    );
    return root;
  }

  return helper(0, 0, inorder.length - 1, preorder, inorder);
}

function treeLevelTraversal(root) {
  if (!root) {
    return [];
  }

  const queue = [[root]];
  const levels = [];
  while (queue.length) {
    const nextNodes = queue.shift();
    const level = [];
    const nextLevel = [];

    for (const node of nextNodes) {
      level.push(node.data);

      if (node.left) {
        nextLevel.push(node.left);
      }
      if (node.right) {
        nextLevel.push(node.right);
      }
    }

    levels.push(level);
    if (nextLevel.length) {
      queue.push(nextLevel);
    }
  }

  return levels;
}
// console.log(treeLevelTraversal(root));

function closestBTValue(root, target) {
  let child = root.data < target ? root.right : root.left;

  if (child == null) {
    return root.data;
  }

  let childClose = closestBTValue(child, target);

  return Math.abs(target - childClose) > Math.abs(target - root.data)
    ? root.data
    : childClose;
}
// console.log(closestBTValue(root, 5));

function leftFlipBinaryTree(root) {
  if (!root) {
    return root;
  }

  if (!root.left && !root.right) {
    return root;
  }

  // traverse till left leaf
  let flippedRoot = leftFlipBinaryTree(root.left);

  // pivoting the tree over root left node
  root.left.left = root.right;
  root.left.right = root;
  root.left = root.right = null;

  return flippedRoot;
}
// const result = leftFlipBinaryTree(root);
// console.log(JSON.stringify(result));

function invertTree(root) {
  if (!root) {
    return root;
  }

  let left = invertTree(root.left);
  let right = invertTree(root.right);

  root.left = right === undefined ? null : right;
  root.right = left === undefined ? null : left;

  return root;
}

// function isBST(root) {
//   function isBSTUtil(node, min, max) {
//     if (node == null) {
//       return true;
//     }
//     if (node.data < min || node.data > max) {
//       return false;
//     }
//     return (
//       isBSTUtil(node.left, min, node.data - 1) &&
//       isBSTUtil(node.right, node.data + 1, max)
//     );
//   }
//   return isBSTUtil(root, Number.MIN_VALUE, Number.MAX_VALUE);
// }

function isValidBST(root) {
  function isValid(root, min, max) {
    if (!root) {
      return true;
    }
    if (root.data >= max || root.data <= min) {
      return false;
    }
    return (
      isValid(root.left, min, root.data) && // for left subtree the root is max
      isValid(root.right, root.data, max) // for right substree the root is min
    );
  }
  return isValid(root, -Infinity, Infinity);
}

function isSymmetric(root) {
  if (!root) {
    return true;
  }

  function checkSymmetric(left, right) {
    if (!left && !right) {
      return true;
    }
    if ((!left && right) || (!right && left)) {
      return false;
    }
    if (left.value !== right.value) {
      return false;
    }

    return (
      checkSymmetric(left.left, right.right) &&
      checkSymmetric(left.right, right.left)
    );
  }

  return checkSymmetric(root.left, root.right);
}

/**
 *               1
 *             /   \
 *            2     3
 *           / \   / \
 *          4   5 6   7
 *               / \
 *              8   9
 */
function lowestCommonAncestor(root, p, q) {
  if (root == null) {
    return root;
  }
  if (root == p || root == q) {
    return root;
  }
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);

  // if left and right both null, the node is found in both subtrees
  if (left != null && right != null) {
    return root;
  }
  return left == null ? right : left;
}
// console.log(lowestCommonAncestor(root, root.left.right, root.right.left));

function minDepth(root) {
  if (root == null) {
    return 0;
  }

  let l = minDepth(root.left);
  let r = minDepth(root.right);

  if (l != 0 && r != 0) {
    return Math.min(l, r) + 1;
  }

  if (l == 0) {
    return r + 1;
  }

  return l + 1;
}
// console.log(minDepth(root));

// like left flip
function upsideDownBinaryTree(root) {
  if (root == null) return root;
  if (root.left == null && root.right == null) return root;

  let newRoot = upsideDownBinaryTree(root.left);
  let newLeft = root.right;
  let oldLeft = root.left;

  root.left = null;
  root.right = null;
  oldLeft.left = newLeft;
  oldLeft.right = root;

  return newRoot;
}

function maxDepth(root) {
  function _max(root, depth) {
    if (!root) {
      return depth;
    }

    const l = _max(root.left, depth + 1);
    const r = _max(root.right, depth + 1);

    return Math.max(l, r);
  }

  return _max(root, 0);
}
console.log(maxDepth(root));