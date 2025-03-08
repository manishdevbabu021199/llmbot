import os
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
import requests
import tiktoken
from firebase_admin import firestore

db = firestore.client()
router = APIRouter()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL")

encoder = tiktoken.get_encoding("cl100k_base")


class ChatRequest(BaseModel):
    message: str
    history: list


def retrieve_tasks_from_firestore():
    """Fetch and return only task names from Firestore."""
    docs = db.collection("tasks").stream()

    task_list = []

    for doc in docs:
        data = doc.to_dict()
        # Assuming each task has a "title" field
        task_name = data.get("taskname", None)

        if task_name:
            task_list.append(task_name)

    if task_list:
        return "Here are your tasks: " + ", ".join(task_list)

    return "No tasks found."


@router.post("/chat")
def chat_with_groq(request: ChatRequest):
    # Get tasks from Firestore
    tasks = retrieve_tasks_from_firestore()

    # Create the LLM input
    messages = [
        {"role": "system", "content": "You are an AI assistant. Only respond with the task names, nothing else.You can also provide some more context on the task when i say, also provide code snippets when needed"},
        {"role": "user", "content": f"My tasks are: {tasks}. Now, {request.message}"}
    ] + request.history

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.3-70b-versatile",  # Change model if needed
        "messages": messages,
        "max_completion_tokens": 1024,

    }

    response = requests.post(GROQ_API_URL, json=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=response.text)

    return response.json()["choices"][0]["message"]["content"]
