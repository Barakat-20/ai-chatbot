from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
class Message(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "AI Chatbot is running!"}

@app.post("/chat")
async def chat(data: Message):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant. Be friendly, concise and professional."
                },
                {
                    "role": "user",
                    "content": data.message
                }
            ],
            max_tokens=500
        )
        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Sorry, something went wrong: {str(e)}"}