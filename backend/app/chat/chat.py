import os
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from pydantic import BaseModel
import requests
import tiktoken
from firebase_admin import firestore
from auth.auth import verify_token
from .models import DataFilter, ChatRequest

db = firestore.client()
router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL")

encoder = tiktoken.get_encoding("cl100k_base")


def retrieve_data_from_firestore(data_filter: DataFilter, userid: str):
    data_list = []

    if data_filter.id == "tasks":
        # If the id is 'tasks', fetch only the tasks of the specific user
        docs = db.collection("tasks").where("userid", "==", userid).stream()
        for doc in docs:
            data = doc.to_dict()
            data_list.append(data)
    elif data_filter.id in ["groups", "escalations"]:
        # If the id is 'groups'| 'escalations'
        docs = db.collection(data_filter.id).stream()
        for doc in docs:
            data = doc.to_dict()
            data_list.append(data)
    else:
        # Handle specific documents if needed, like filtering for a group id
        docs = db.collection("groups").document(data_filter.id).get()
        data = docs.to_dict()
        data_list.append(data)

    if data_list:
        return f"Here is the data: {data_list}"

    return "No data found."


@router.post("/chat", dependencies=[Depends(verify_token)])
def chat_with_groq(request: ChatRequest, user_data=Depends(verify_token)):
    userid = user_data["uid"]

    response_data = retrieve_data_from_firestore(request.data, userid)

    context_type = "tasks" if request.data.id == "tasks" else request.data.id

    messages = [
        {"role": "system", "content": f"You are an AI assistant. You should respond with relevant details about {context_type}. You can also provide additional context or code snippets when needed, also try to summarize when user asks for something dont just read the data, also don't reveal id fields, sensitive data and field names. Don't style the texts"},
        {"role": "user", "content": f"My {context_type} details are:\n{response_data}\nNow, {request.message}"}
    ] + request.history

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "max_completion_tokens": 1024,
    }

    response = requests.post(GROQ_API_URL, json=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=response.text)

    return response.json()["choices"][0]["message"]["content"]
