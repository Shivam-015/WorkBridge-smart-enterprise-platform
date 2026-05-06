"""
watcher.py
Watches the project for file changes and auto re-indexes into ChromaDB.
Run this in background: python watcher.py
"""

import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from indexer import index_file, get_collection, PROJECT_ROOT, SCAN_PATHS, ALLOWED_EXTENSIONS

class CodebaseChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.collection = get_collection()

    def _should_index(self, path: str) -> bool:
        ext = os.path.splitext(path)[1]
        if ext not in ALLOWED_EXTENSIONS:
            return False
        # Skip hidden, cache, migrations folders
        skip_dirs = {"node_modules", "__pycache__", "migrations", ".git", "chroma_db"}
        parts = set(path.split(os.sep))
        return not parts.intersection(skip_dirs)

    def on_modified(self, event):
        if not event.is_directory and self._should_index(event.src_path):
            rel = os.path.relpath(event.src_path, PROJECT_ROOT)
            print(f"🔄 File changed, re-indexing: {rel}")
            index_file(event.src_path, self.collection)

    def on_created(self, event):
        if not event.is_directory and self._should_index(event.src_path):
            rel = os.path.relpath(event.src_path, PROJECT_ROOT)
            print(f"🆕 New file, indexing: {rel}")
            index_file(event.src_path, self.collection)

    def on_deleted(self, event):
        if not event.is_directory:
            rel = os.path.relpath(event.src_path, PROJECT_ROOT)
            print(f"🗑️  File deleted: {rel} (will be excluded from future retrievals)")

def start_watcher():
    handler = CodebaseChangeHandler()
    observer = Observer()

    for rel_path in SCAN_PATHS:
        abs_path = os.path.join(PROJECT_ROOT, rel_path)
        if os.path.exists(abs_path):
            observer.schedule(handler, abs_path, recursive=True)
            print(f"👁️  Watching: {rel_path}")

    observer.start()
    print("\n✅ Watcher running — any file change will auto re-index. Press Ctrl+C to stop.\n")

    try:
        while True:
            time.sleep(2)
    except KeyboardInterrupt:
        observer.stop()
        print("\n🛑 Watcher stopped.")
    observer.join()

if __name__ == "__main__":
    start_watcher()
