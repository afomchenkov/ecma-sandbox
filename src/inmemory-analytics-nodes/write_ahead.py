import os
import json

class WALFileWriter:
    def __init__(self, data_file='data.txt', log_file='wal.log'):
        self.data_file = data_file
        self.log_file = log_file
        self._initialize_files()

    def _initialize_files(self):
        # Ensure both files exist
        if not os.path.exists(self.data_file):
            open(self.data_file, 'w').close()
        if not os.path.exists(self.log_file):
            open(self.log_file, 'w').close()

    def _write_to_file(self, file_path, content):
        with open(file_path, 'a') as file:
            file.write(content + '\n')

    def insert(self, record):
        # Convert record to JSON for storage
        record_json = json.dumps(record)

        # Step 1: Append to WAL
        self._write_to_file(self.log_file, record_json)

        # Step 2: Flush WAL to disk
        with open(self.log_file, 'a') as log:
            log.flush()
            os.fsync(log.fileno())

        # Step 3: Apply to main data file
        self._write_to_file(self.data_file, record_json)

        # Optional: Clear WAL after successful write
        with open(self.log_file, 'w') as log:
            log.truncate(0)

    def recover(self):
        # Check for unprocessed log entries
        with open(self.log_file, 'r') as log:
            lines = log.readlines()

        if lines:
            print("Recovering from WAL...")
            with open(self.data_file, 'a') as data:
                for line in lines:
                    data.write(line)

            # Clear the log file after recovery
            with open(self.log_file, 'w') as log:
                log.truncate(0)

    def read_all(self):
        # Read all records from the main data file
        with open(self.data_file, 'r') as file:
            return [json.loads(line.strip()) for line in file.readlines()]

# Example Usage
if __name__ == "__main__":
    writer = WALFileWriter()

    # Recovery on startup
    writer.recover()

    # Insert records
    writer.insert({"id": 1, "name": "Alice", "amount": 100})
    writer.insert({"id": 2, "name": "Bob", "amount": 200})

    # Read all records
    records = writer.read_all()
    print("Records:", records)
