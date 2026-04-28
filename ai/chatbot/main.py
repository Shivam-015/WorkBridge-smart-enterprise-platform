"""
main.py — WorkBridge Chatbot FastAPI Server
Powered by Groq API (free, cloud-based llama3)
"""
from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from retriever import search_context
from ollama_client import ask_ollama
import uvicorn

app = FastAPI(title="WorkBridge Chatbot API")

# ── CORS — allow local dev + your Render frontend URL ────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    # Add your Render frontend URL here when deploying:
    "https://workbridge-smart-enterprise-platform-1.onrender.com",
    "*",  # fallback — restrict in production if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    user_role: str = "employee"

class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = []

@app.get("/health")
def health():
    groq_key_set = bool(os.getenv("GROQ_API_KEY", ""))
    return {
        "status": "ok",
        "service": "WorkBridge Chatbot",
        "ai_provider": "Groq",
        "groq_key_configured": groq_key_set
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    context_chunks, sources = search_context(req.question)
    answer = await ask_ollama(
        question=req.question,
        context_chunks=context_chunks,
        user_role=req.user_role
    )

    return ChatResponse(answer=answer, sources=sources)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
