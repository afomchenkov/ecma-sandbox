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

function sortGraph(n, edges) {
    function topologicalSort(adj, edgesCount) {
        const indegree = new Array(edgesCount).fill(0);
        for (let i = 0; i < edgesCount; i++) {
            for (const vertex of adj[i]) {
                // count the total number of incoming edges
                indegree[vertex]++;
            }
        }

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
console.log('Topological sort: ', sortGraph(6, [[0, 1], [1, 2], [2, 3], [4, 5], [5, 1], [5, 2]]));
