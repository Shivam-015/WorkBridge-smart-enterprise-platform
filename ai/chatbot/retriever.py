"""
retriever.py
Searches ChromaDB for relevant context chunks.
Handles empty or missing ChromaDB gracefully.
"""

import os

CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "workbridge_codebase"

def search_context(question: str, n_results: int = 5) -> tuple[list[str], list[str]]:
    """
    Returns:
        context_chunks: list of relevant text snippets
        sources: list of file paths these came from
    """
    try:
        import chromadb
        from chromadb.utils import embedding_functions

        # Check if chroma_db folder exists at all
        if not os.path.exists(CHROMA_DB_PATH):
            return [], []

        embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=embedding_fn
        )

        count = collection.count()
        if count == 0:
            return [], []

        results = collection.query(
            query_texts=[question],
            n_results=min(n_results, count),
            include=["documents", "metadatas"]
        )

        chunks = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []
        sources = list({m["source"] for m in metadatas})

        return chunks, sources

    except Exception:
        # If anything fails (no DB, wrong version, etc.) just return empty
        return [], []
