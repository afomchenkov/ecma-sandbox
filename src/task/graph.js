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
