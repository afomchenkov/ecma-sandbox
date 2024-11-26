class ListNode {
  next = null;
  constructor(val) {
    this.val = val;
  }
}

const root = new ListNode(
  9,
  new ListNode(
    1,
    new ListNode(
      4,
      new ListNode(11, new ListNode(3, new ListNode(15, new ListNode(2))))
    )
  )
);

// ------------------------------------------------------------------

function addTwoNumbers(l1, l2) {
  let dummyHead = new ListNode(-1);
  let curr = dummyHead;
  let carry = 0;

  while (l1 || l2 || carry != 0) {
    let x = l1 != null ? l1.val : 0;
    let y = l2 != null ? l2.val : 0;

    let sum = carry + x + y;

    carry = parseInt(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;

    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }

  return dummyHead.next;
}

const removeElement = (head, val) => {
  if (!head) {
    return nullptr;
  }

  if (head && !head.next) {
    if (head.val == val) {
      return nullptr;
    } else {
      return head;
    }
  }

  let dummy = new Node(0, head);
  let prev = dummy;

  while (head) {
    if (head.val == val) {
      prev.next = head.next;
      head = prev;
    }

    prev = head;
    head = head.next;
  }

  return dummy.next;
};

function hasCycle(head) {
  if (head == null || head.next == null) {
    return false;
  }

  let slow = head;
  let fast = head.next;
  while (fast && fast.next && fast != slow) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return fast == slow;
}

function hasListCycle(head) {
  if (head == null || head.next == null) {
    return false;
  }
  let p = head;
  let q = head.next;

  while (p && q) {
    if (p == q) {
      return true;
    }
    p = p.next;
    q = q.next;
    if (q != null) {
      q = q.next;
    }
  }
  return false;
}

const mergeTwoLists = (list1, list2) => {
  if (!list1 && !list2) {
    return nullptr;
  }

  let head = nullptr;
  if (list1.val < list2.val) {
    head = list1;
    list1 = list1.next;
  } else {
    head = list2;
    list2 = list2.next;
  }
  let curr = head;

  while (list1 || list2) {
    if (!list1) {
      curr.next = list2;
      list2 = list2.next;
    } else if (!list2) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      if (list1.val < list2.val) {
        curr.next = list1;
        list1 = list1.next;
      } else {
        curr.next = list2;
        list2 = list2.next;
      }
    }

    curr = curr.next;
  }

  return head;
};

// Given a sorted linked list, delete all duplicates such that each element appear only once.
function deleteDuplicates(head) {
  if (head == null || head.next == null) {
    return head;
  }

  let h = head; // copy list head
  let prev = head;
  let curr = head.next;

  while (curr) {
    if (curr.val == prev.val) {
      prev.next = curr.next;
    } else {
      // move prev
      prev.next = curr;
      prev = prev.next;
    }
    // move curr
    curr = curr.next;
  }

  return h;
}

/**
 * Given a linked list and a value x, partition it such that all nodes
 * less than x come before nodes greater than or equal to x.
 *
 * Example:
 * list = 1 -> 4 -> 3 -> 2 -> 5 -> 2, x = 3
 * return 1 -> 2 -> 2 -> 4 -> 3 -> 5
 */
function partitionList(head, x) {
  let gt = new ListNode(-1);
  let lt = new ListNode(-1);
  let t1 = gt; // list with greater or equal nodes
  let t2 = lt; // list for less than nodes

  while (head) {
    if (head.val < x) {
      t2.next = head;
      t2 = t2.next;
    } else {
      t1.next = head;
      t1 = t1.next;
    }
    head = head.next;
  }

  t2.next = gt.next; // append greater part
  t1.next = null;
  return lt.next;
}
