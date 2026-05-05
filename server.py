from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# This stores the conversation history
conversation_history = [
    {
        "role": "system",
        "content": "You are a helpful assistant. Be friendly, concise and professional."
    }
]

class Message(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "AI Chatbot is running!"}

@app.post("/chat")
async def chat(data: Message):
    try:
        # Add user message to history
        conversation_history.append({
            "role": "user",
            "content": data.message
        })

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=conversation_history,
            max_tokens=500
        )

        reply = response.choices[0].message.content

        # Add AI response to history
        conversation_history.append({
            "role": "assistant",
            "content": reply
        })

        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Sorry, something went wrong: {str(e)}"}

@app.post("/clear")
async def clear():
    global conversation_history
    conversation_history = [
        {
            "role": "system",
            "content": "You are a helpful assistant. Be friendly, concise and professional."
        }
    ]
    return {"status": "cleared"}