"""
indexer.py
Scans the entire WorkBridge project (backend models, views, urls + frontend pages, components)
and stores chunks in ChromaDB for retrieval.
Run this once manually, then watcher.py keeps it updated automatically.
"""

import os
import chromadb
from chromadb.utils import embedding_functions

# ── Config ──────────────────────────────────────────────────────────────────
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

# Folders to scan (relative to project root)
SCAN_PATHS = [
    "backend/accounts",
    "backend/companies",
    "backend/config",
    "frontend/src/pages",
    "frontend/src/components",
    "frontend/src/lib",
]

# File extensions to index
ALLOWED_EXTENSIONS = {".py", ".jsx", ".js", ".tsx", ".ts"}

CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "workbridge_codebase"

# ── ChromaDB setup ───────────────────────────────────────────────────────────
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"  # small, fast, free, runs locally
)

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

def get_collection():
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn
    )

# ── File reading ─────────────────────────────────────────────────────────────
def read_file_safe(filepath: str) -> str:
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception:
        return ""

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks so context isn't cut mid-sentence."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return [c.strip() for c in chunks if c.strip()]

# ── Main indexing function ───────────────────────────────────────────────────
def index_file(filepath: str, collection):
    content = read_file_safe(filepath)
    if not content:
        return

    rel_path = os.path.relpath(filepath, PROJECT_ROOT)
    chunks = chunk_text(content)

    ids = [f"{rel_path}::chunk{i}" for i in range(len(chunks))]
    metadatas = [{"source": rel_path, "chunk": i} for i in range(len(chunks))]

    # Upsert so re-indexing doesn't duplicate
    collection.upsert(
        ids=ids,
        documents=chunks,
        metadatas=metadatas
    )
    print(f"  ✅ Indexed: {rel_path} ({len(chunks)} chunks)")

def index_all():
    print("🔍 Starting full codebase indexing...")
    collection = get_collection()
    total = 0

    for rel_path in SCAN_PATHS:
        abs_path = os.path.join(PROJECT_ROOT, rel_path)
        if not os.path.exists(abs_path):
            print(f"  ⚠️  Path not found, skipping: {rel_path}")
            continue

        for root, dirs, files in os.walk(abs_path):
            # Skip node_modules, __pycache__, migrations
            dirs[:] = [d for d in dirs if d not in {"node_modules", "__pycache__", "migrations", ".git"}]
            for filename in files:
                ext = os.path.splitext(filename)[1]
                if ext in ALLOWED_EXTENSIONS:
                    index_file(os.path.join(root, filename), collection)
                    total += 1

    print(f"\n✨ Indexing complete! {total} files indexed into ChromaDB.")

if __name__ == "__main__":
    index_all()
