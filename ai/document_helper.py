def summarize_document(text):
    lines = text.split(".")
    summary = lines[:3]   

    return {
        "summary": ".".join(summary).strip(),
        "key_points": summary
    }