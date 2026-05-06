"""
ollama_client.py (now powered by Groq)
Sends the retrieved context + user question to Groq API.
Same interface as before — no other files need to change.
"""

import os
from groq import Groq

# ── Config ───────────────────────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = "llama-3.3-70b-versatile"  # Free Groq model — same as llama3 locally

SYSTEM_PROMPT = """You are WorkBridge Assistant — a helpful AI chatbot embedded inside WorkBridge,
a smart enterprise platform for managing employees, admins, managers, HR, and company operations.

You are given relevant code and data from the WorkBridge codebase as context.
Use this context to answer the user's question accurately.

Rules:
- ALWAYS format your response using bullet points (start each point with "- ")
- Use short, clear bullet points — not long paragraphs
- Maximum 5-6 bullet points per response
- If listing steps, number them: 1. 2. 3.
- Start with one short sentence summary, then bullet points
- The user's role is: {user_role}. Tailor the answer to what that role can see/do.
- Never expose raw code or internal implementation details — explain in plain English.
- If the context doesn't cover the question, say "I don't have enough information about that yet."
"""

async def ask_ollama(question: str, context_chunks: list[str], user_role: str = "employee") -> str:
    """
    Named ask_ollama to keep compatibility with main.py.
    Now uses Groq under the hood.
    """
    if not GROQ_API_KEY:
        return "❌ GROQ_API_KEY is not set. Add it to your environment variables."

    context_text = "\n\n---\n\n".join(context_chunks) if context_chunks else "No specific context found."

    prompt = f"""Context from WorkBridge codebase:
{context_text}

---

User ({user_role}) asks: {question}

Answer:"""

    system = SYSTEM_PROMPT.format(user_role=user_role)

    try:
        client = Groq(api_key=GROQ_API_KEY)

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.3,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        error = str(e)
        if "api_key" in error.lower() or "auth" in error.lower():
            return "❌ Invalid Groq API key. Check your GROQ_API_KEY environment variable."
        return f"❌ Groq API error: {error}"
