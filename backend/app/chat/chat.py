import os
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from pydantic import BaseModel
import requests
import tiktoken
from firebase_admin import firestore
from auth.auth import verify_token

db = firestore.client()
router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL")

encoder = tiktoken.get_encoding("cl100k_base")

class DataFilter(BaseModel):
    id: str
    filter_field: str = None


class ChatRequest(BaseModel):
    message: str
    history: list
    data: DataFilter


def retrieve_data_from_firestore(data_filter: DataFilter, userid: str):
    data_list = []

    if data_filter.id == "tasks":
        # If the id is 'tasks', fetch only the tasks of the specific user
        docs = db.collection("tasks").where("userid", "==", userid).stream()
        for doc in docs:
            data = doc.to_dict()  # Get all fields of the document
            # Add the entire document dictionary to the list
            data_list.append(data)
    elif data_filter.id in ["groups", "escalations"]:
        docs = db.collection(data_filter.id).stream()
        for doc in docs:
            data = doc.to_dict()
            data_list.append(data)
    else:
        # Handle specific documents if needed, like filtering for a group id
        docs = db.collection("groups").document(data_filter.id).get()
        data = docs.to_dict()
        # Add the entire document dictionary to the list
        data_list.append(data)

    # If data is found, return it in a suitable format
    if data_list:
        return f"Here is the data: {data_list}"

    return "No data found."


@router.post("/chat", dependencies=[Depends(verify_token)])
def chat_with_groq(request: ChatRequest, user_data=Depends(verify_token)):
    userid = user_data["uid"]

    # Fetch relevant data from Firestore
    response_data = retrieve_data_from_firestore(request.data, userid)

    # Define context_type based on the collection
    context_type = "tasks" if request.data.id == "tasks" else request.data.id

    # Construct chatbot prompt
    messages = [
        {"role": "system", "content": f"You are an AI assistant. You should respond with relevant details about {context_type}. You can also provide additional context or code snippets when needed, also try to summarize when user asks for something dont just read the data, also don't reveal id fields and sensitive data"},
        {"role": "user", "content": f"My {context_type} details are:\n{response_data}\nNow, {request.message}"}
    ] + request.history

    # API request headers and payload for GroQ API
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "max_completion_tokens": 1024,
    }

    # Make request to GroQ API
    response = requests.post(GROQ_API_URL, json=payload, headers=headers)

    # Handle response errors
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=response.text)

    # Return chatbot response from GroQ API
    return response.json()["choices"][0]["message"]["content"]
