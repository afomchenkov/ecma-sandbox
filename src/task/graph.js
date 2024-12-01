function dijkstraMinPath(edges, start, end) {
  // build graph
  const graph = new Map();
  for (const [from, to, distance] of edges) {
    if (graph.has(from)) {
      graph.get(from).push({ to, distance });
    } else {
      graph.set(from, [{ to, distance }]);
    }
  }

  const queue = [[0, [], start]]; // [totalMin, path, next]
  const marked = new Set();

  while (queue.length) {
    let [cost, path, v1] = queue.pop(); // next min weight

    if (!marked.has(v1)) {
      marked.add(v1);

      path = [...path, v1];
      if (v1 === end) {
        return [cost, path];
      }

      for (const { to, distance } of graph.get(v1)) {
        if (!marked.has(to)) {
          queue.push([cost + distance, path, to]);
          queue.sort((a, b) => {
            return a[0] < b[0];
          });
        }
      }
    }
  }

  return [null];
}

const edges = [
  ["A", "B", 7],
  ["A", "D", 5],
  ["B", "C", 8],
  ["B", "D", 9],
  ["B", "E", 7],
  ["C", "E", 5],
  ["D", "E", 7],
  ["D", "F", 6],
  ["E", "F", 8],
  ["E", "G", 9],
  ["F", "G", 11],
];

// console.log(JSON.stringify(dijkstraMinPath(edges, 'A', 'G')));

// Kahn’s algorithm for topological sorting
// Topological sorted order: It is a linear ordering of vertices such that for
// every directed edge u -> v, where vertex u comes before v in the ordering.

// Example:
// Input: V=6 , E = {{2,3}, {3,1}, {4,0}, {4,1}, {5,0}, {5,2}}
// Output: 4 5 2 0 3 1
//
// Input: V=5 , E={{0,1}, {1,2}, {3,2}, {3,4}}
// Output: 0 3 4 1 2

// Kahn’s Algorithm for Topological Sorting is a method used to order the vertices of a directed
// graph in a linear order such that for every directed edge from vertex A to vertex B, A comes
// before B in the order. The algorithm works by repeatedly finding vertices with no incoming edges,
// removing them from the graph, and updating the incoming edges of the remaining vertices.
// This process continues until all vertices have been ordered.
// Function to return list containing vertices in Topological order.
//
// To find the in-degree of each node by initially calculating the number of incoming edges to each node.
// Iterate through all the edges in the graph and increment the in-degree of the destination node for
// each edge.
// This way, you can determine the in-degree of each node before starting the sorting process.

// Applications tasks:
// - Course sequencing
// - Management of software dependencies
// - Scheduling tasks
// - Data processing
// - Circuit design

function sortGraph(n, edges) {
  function topologicalSort(adj, edgesCount) {
    const indegree = new Array(edgesCount).fill(0);
    for (let i = 0; i < edgesCount; i++) {
      for (const vertex of adj[i]) {
        // count the total number of incoming edges
        indegree[vertex]++;
      }
    }

    // find the root node(s) with zero incoming edges
    const q = [];
    for (let i = 0; i < edgesCount; i++) {
      if (indegree[i] === 0) {
        q.push(i);
      }
    }

    const result = [];
    while (q.length > 0) {
      const node = q.shift();
      result.push(node);

      for (const adjacent of adj[node]) {
        indegree[adjacent]--;
        if (indegree[adjacent] === 0) {
          q.push(adjacent);
        }
      }
    }

    if (result.length !== edgesCount) {
      console.log("Graph contains cycle!");
      return [];
    }
    return result;
  }

  const adjacencyList = Array.from({ length: n }, () => []);
  for (const edge of edges) {
    adjacencyList[edge[0]].push(edge[1]);
  }

  return topologicalSort(adjacencyList, n);
}
const gr1 = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 1], [5, 2]];
const gr2 = [[2, 3], [3, 1], [4, 0], [4, 1], [5, 0], [5, 2]];
console.log('Topological sort: ', sortGraph(6, gr2));

// In a directed acyclic graph, we can use Kahn's algorithm to get the topological ordering. Kahn’s algorithm
// works by keeping track of the number of incoming edges into each node (indegree). It works by repeatedly
// visiting the nodes with an indegree of zero and deleting all the edges associated with it leading to a decrement
// of indegree for the nodes whose incoming edges are deleted. This process continues until no elements with zero
// indegree can be found.
// The advantage of using Kahn's algorithm is that it also aids in the detection of graph cycles.

function canFinishCourses(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (let pre of prerequisites) {
    adj[pre[1]].push(pre[0]);
    indegree[pre[0]]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] == 0) {
      queue.push(i);
    }
  }

  const result = [];
  while (queue.length) {
    const next = queue.pop();
    result.push(next);

    for (const v of adj[next]) {
      indegree[v]--;
      if (indegree[v] == 0) {
        queue.push(v);
      }
    }
  }

  return result.length == numCourses;
}

function canFinishDfs(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);

  for (let prerequisite of prerequisites) {
    adj[prerequisite[1]].pus(prerequisite[0]);
  }

  function dfs(node, adj, visit, inStack) {
    // If the node is already in the stack, we have a cycle.
    if (inStack[node]) {
      return true;
    }
    if (visit[node]) {
      return false;
    }
    // Mark the current node as visited and part of current recursion stack.
    visit[node] = true;
    inStack[node] = true;
    for (let neighbor of adj[node]) {
      if (dfs(neighbor, adj, visit, inStack)) {
        return true;
      }
    }
    // Remove the node from the stack.
    inStack[node] = false;
    return false;
  }

  const visit = new Array(numCourses).fill(false);
  const inStack = new Array(numCourses).fill(false);
  for (let i = 0; i < numCourses; i++) {
    if (dfs(i, adj, visit, inStack)) {
      return false;
    }
  }
  return true;
}