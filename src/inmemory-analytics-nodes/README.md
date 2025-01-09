## Order Structure

```
orderId (unique identifier for the order)
beginTime (datetime, when the order started)
finishTime (datetime, when the order finished)
duration (calculated as finishTime - beginTime, for convenience)
metadata (the rest of the blob data)
```

## API

```
/insertOrder(order: Order): void

    Append the order to a local file or log structure on disk.
    Update in-memory indices:
        Index by beginTime for range-based queries.
        Maintain a priority queue (or sorted list) for quick access to the top N longest/shortest orders.


/getLongestNOrdersByDuration(n: int, startTime: datetime, endTime: datetime): Order[]

    Filter orders by beginTime within the range [startTime, endTime].
    Use a max-heap to efficiently extract the top N longest orders.


/getShortestNOrdersByDuration(n: int, startTime: datetime, endTime: datetime): Order[]

    Filter orders by beginTime within the range [startTime, endTime].
    Use a min-heap to efficiently extract the top N shortest orders.
```

## Partitioning and Sharding

Partition data by beginTime (e.g., month or day).
Each partition is managed by a separate worker node, allowing for parallel processing.


## Flow
```
InsertOrder

    Append the order to the appropriate partition file.
    Update:
        A sorted list or BST (by beginTime) for range filtering.
        A max-heap for the top N longest durations.
        A min-heap for the top N shortest durations.

GetLongestNOrdersByDuration

    Filter relevant partitions by startTime and endTime.
    Merge results from nodes using a max-heap to extract the top N longest orders.

GetShortestNOrdersByDuration

    Filter relevant partitions by startTime and endTime.
    Merge results from nodes using a min-heap to extract the top N shortest orders.
```

## Optimization Strategies
```
Indexing
    Use in-memory data structures like sorted arrays or balanced trees (e.g., AVL, Red-Black) for efficient range queries.
    Keep a mapping of orderId to the corresponding file location for efficient retrieval.

Compression
    Compress older partitions to save disk space, decompress on demand.

Parallelization
    Distribute queries across partitions to leverage multiple machines.

Caching
    Cache recently queried results to minimize disk reads for frequent queries.
```

## Fault Tolerance
```
- Replicate data across multiple machines to handle node failures.
- Use write-ahead logging to ensure durability of inserts.
```

## Scaling Considerations
```
- Horizontal Scaling: Add more worker nodes to handle increased order volume or queries.
- Data Retention: Archive or delete old orders to manage storage limits.
```
