class Node {
  constructor(node) {
    this.next = node;
  }
}
class linkedlist {
  constructor() {
    this.head = null;
  }

  append(Node, node) {
    if (head === null) {
      head = new Node(node);
    } else {
      console.log(321);
      //find last
      // Node last = head
      // while(last.next)
    }
  }
  insert() {}
}

let func1 = (n) => {
  if (n === 1) {
    return 1;
  } else {
    return n * func1(n - 1);
  }
};
