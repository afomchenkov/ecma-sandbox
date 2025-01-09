import heapq

class Order:
    def __init__(self, id, beginTime, endTime):
        self.id = id
        self.beginTime = beginTime
        self.endTime = endTime
        self.duration = endTime - startTime


class AnalyticsSystem:
    def __init__(self, num_shards):
        self.num_shards = num_shards
        self.shards = [{} for _ in range(num_shards)]  # List of dictionaries per shard
        self.sorted_orders = [{} for _ in range(num_shards)]  # Maintain sorted index


    def _get_shard(self, order_id):
        return hash(order_id) % self.num_shards


    def insert_order(self, order):
        """
        Inserts an order into the system.
        """
        shard_id = self._get_shard(order['orderId'])
        shard = self.shards[shard_id]

        # Add order to shard
        shard[order['orderId']] = order

        # Add to sorted index
        if 'beginTime' not in self.sorted_orders[shard_id]:
            self.sorted_orders[shard_id]['beginTime'] = []
        self.sorted_orders[shard_id]['beginTime'].append(order)

        # Sort index for efficient range queries
        self.sorted_orders[shard_id]['beginTime'].sort(key=lambda x: x['beginTime'])
        
        
    def _filter_orders_by_time(self, shard_id, start_time, end_time):
        """
        Filter orders in the shard based on time range.
        """
        return [
            order for order in self.sorted_orders[shard_id]['beginTime']
            if start_time <= order['beginTime'] <= end_time
        ]


    def get_longest_n_orders_by_duration(self, n, start_time, end_time):
        """
        Retrieve the longest n orders by duration.
        """
        result_heap = []

        for shard_id in range(self.num_shards):
            orders = self._filter_orders_by_time(shard_id, start_time, end_time)
            for order in orders:
                duration = order['finishTime'] - order['beginTime']
                if len(result_heap) < n:
                    heapq.heappush(result_heap, (duration, order))
                else:
                    heapq.heappushpop(result_heap, (duration, order))

        return [order for _, order in sorted(result_heap, reverse=True)]


    def get_shortest_n_orders_by_duration(self, n, start_time, end_time):
        """
        Retrieve the shortest n orders by duration.
        """
        result_heap = []

        for shard_id in range(self.num_shards):
            orders = self._filter_orders_by_time(shard_id, start_time, end_time)
            for order in orders:
                duration = order['finishTime'] - order['beginTime']
                if len(result_heap) < n:
                    heapq.heappush(result_heap, (-duration, order))
                else:
                    heapq.heappushpop(result_heap, (-duration, order))

        return [order for _, order in sorted(result_heap)]

        