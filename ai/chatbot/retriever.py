"""
retriever.py
Searches ChromaDB for the most relevant code/context chunks for a given question.
"""

from indexer import get_collection

def search_context(question: str, n_results: int = 5) -> tuple[list[str], list[str]]:
    """
    Returns:
        context_chunks: list of relevant text snippets
        sources: list of file paths these came from
    """
    collection = get_collection()

    # If collection is empty, return gracefully
    try:
        count = collection.count()
        if count == 0:
            return [], []
    except Exception:
        return [], []

    results = collection.query(
        query_texts=[question],
        n_results=min(n_results, collection.count()),
        include=["documents", "metadatas"]
    )

    chunks = results["documents"][0] if results["documents"] else []
    metadatas = results["metadatas"][0] if results["metadatas"] else []
    sources = list({m["source"] for m in metadatas})  # unique file paths

    return chunks, sources
