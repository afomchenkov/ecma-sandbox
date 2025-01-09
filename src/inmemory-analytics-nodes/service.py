from flask import Flask, request, redirect
from datetime import datetime

app = Flask(__name__)

SHARD_SERVICES = {
    "shard0": "http://service0.default.svc.cluster.local",
    "shard1": "http://service1.default.svc.cluster.local",
}

SHARD_INTERVALS = [
    (datetime(2024, 1, 1), datetime(2024, 2, 1), "shard0"),
    (datetime(2024, 2, 1), datetime(2024, 3, 1), "shard1"),
]

@app.route("/")
def route_request():
    start_date = request.args.get("startDate")
    end_date = request.args.get("endDate")
    
    shard_id = calculate_shard(start_date, SHARD_INTERVALS)
    backend_service = SHARD_SERVICES[shard_id]

    return redirect(backend_service, code=307)

def calculate_shard(start_date, intervals):
    start_date = datetime.fromisoformat(start_date)
    for interval_start, interval_end, shard_id in intervals:
        if interval_start <= start_date < interval_end:
            return shard_id
    raise ValueError("No shard found for the given date")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)